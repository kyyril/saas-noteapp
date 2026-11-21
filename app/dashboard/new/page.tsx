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
import { encrypt } from "@/lib/encryption";
import { recordAuditLog } from "@/lib/audit";
import { noteSchema } from "@/lib/schemas";

export default async function NewNote() {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return redirect("/");
  }

  // Pre-check quota
  const userRecord = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      Subscription: { select: { status: true } },
      _count: { select: { Notes: true } },
    },
  });

  const isSubscribed = userRecord?.Subscription?.status === "active";
  const noteCount = userRecord?._count.Notes ?? 0;

  if (!isSubscribed && noteCount >= 5) {
    return redirect("/dashboard/billings");
  }

  async function postData(formData: FormData) {
    "use server";

    const { getUser: getAuthUser } = getKindeServerSession();
    const currentUser = await getAuthUser();

    if (!currentUser || !currentUser.id) {
      throw new Error("Unauthorized request");
    }

    // Input Validation
    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
    };

    const parsed = noteSchema.safeParse(rawData);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
      throw new Error(`Validation Error: ${errorMsg}`);
    }

    // Server-Side Quota Enforcement
    const dbUser = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        Subscription: { select: { status: true } },
        _count: { select: { Notes: true } },
      },
    });

    const activePlan = dbUser?.Subscription?.status === "active";
    const currentNotes = dbUser?._count.Notes ?? 0;

    if (!activePlan && currentNotes >= 5) {
      return redirect("/dashboard/billings");
    }

    // Field-level encryption at rest
    const encryptedDescription = encrypt(parsed.data.description);

    const newNote = await prisma.notes.create({
      data: {
        userId: currentUser.id,
        title: parsed.data.title,
        description: encryptedDescription,
        isEncrypted: true,
      },
    });

    await recordAuditLog({
      userId: currentUser.id,
      action: "NOTE_CREATED",
      details: `Created note ID: ${newNote.id} (Title: "${parsed.data.title}")`,
    });

    revalidatePath("/dashboard");
    return redirect("/dashboard");
  }

  return (
    <Card>
      <form action={postData}>
        <CardHeader>
          <CardTitle>Create Notes</CardTitle>
          <CardDescription>
            Right here you can create your notes
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-5">
          <div className="gap-y-2 flex flex-col">
            <Label>Title</Label>
            <Input
              required
              type="text"
              name="title"
              placeholder="Title your note"
            />
          </div>
          <div className="gap-y-2 flex flex-col">
            <Label>Description</Label>
            <Textarea
              required
              name="description"
              placeholder="Description your note"
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
