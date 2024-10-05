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
import { unstable_noStore as noStore } from "next/cache";

export default async function NewNote() {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  async function postData(formData: FormData) {
    "use server";

    if (!user) {
      throw new Error("Not authorized");
    }
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    await prisma.notes.create({
      data: {
        userId: user?.id,
        description: description,
        title: title,
      },
    });
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
