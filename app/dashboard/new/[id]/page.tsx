import { SubmitButtonSetting } from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/lib/db";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { decrypt, encrypt } from "@/lib/encryption";
import { recordAuditLog } from "@/lib/audit";
import { noteSchema } from "@/lib/schemas";

async function getData({ userId, noteId }: { userId: string; noteId: string }) {
  noStore();
  const data = await prisma.notes.findFirst({
    where: {
      id: noteId,
      userId: userId,
    },
    select: {
      title: true,
      description: true,
      id: true,
    },
  });

  if (!data) return null;

  return {
    ...data,
    description: decrypt(data.description),
  };
}

export default async function DynamicRoutes({
  params,
}: {
  params: { id: string };
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return redirect("/");
  }

  const data = await getData({ userId: user.id, noteId: params.id });

  if (!data) {
    return redirect("/dashboard");
  }

  async function postData(formData: FormData) {
    "use server";
    const { getUser: getAuthUser } = getKindeServerSession();
    const currentUser = await getAuthUser();

    if (!currentUser || !currentUser.id) {
      throw new Error("You are not allowed");
    }

    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
    };

    const parsed = noteSchema.safeParse(rawData);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
      throw new Error(`Validation Error: ${errorMsg}`);
    }

    const encryptedDescription = encrypt(parsed.data.description);

    // Multi-tenant safe update
    const updated = await prisma.notes.updateMany({
      where: {
        id: params.id,
        userId: currentUser.id,
      },
      data: {
        title: parsed.data.title,
        description: encryptedDescription,
        isEncrypted: true,
      },
    });

    if (updated.count === 0) {
      throw new Error("You are not allowed");
    }

    await recordAuditLog({
      userId: currentUser.id,
      action: "NOTE_UPDATED",
      details: `Updated note ID: ${params.id}`,
    });

    revalidatePath("/dashboard");
    return redirect("/dashboard");
  }

  return (
    <Card>
      <form action={postData}>
        <CardHeader>
          <CardTitle>Edit Notes</CardTitle>
          <CardDescription>Right here you can edit your notes</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-5">
          <div className="gap-y-2 flex flex-col">
            <Label>Title</Label>
            <Input
              required
              type="text"
              name="title"
              placeholder="Title your note"
              defaultValue={data?.title}
            />
          </div>
          <div className="gap-y-2 flex flex-col">
            <Label>Description</Label>
            <Textarea
              required
              name="description"
              placeholder="Description your note"
              defaultValue={data?.description}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button asChild variant={"destructive"}>
            <Link href={"/dashboard"}>Cancel</Link>
          </Button>
          <SubmitButtonSetting />
        </CardFooter>
      </form>
    </Card>
  );
}
