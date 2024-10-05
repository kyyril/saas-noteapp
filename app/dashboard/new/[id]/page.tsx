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

async function getData({ userId, noteId }: { userId: string; noteId: string }) {
  noStore();
  const data = await prisma.notes.findUnique({
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
  return data;
}
export default async function DynamicRoutes({
  params,
}: {
  params: { id: string };
}) {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();
  const data = await getData({ userId: user.id, noteId: params.id });

  async function postData(formData: FormData) {
    "use server";
    if (!user) throw new Error("You not allowed");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    await prisma.notes.update({
      where: {
        id: data?.id,
        userId: user.id,
      },
      data: {
        description: description,
        title: title,
      },
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
