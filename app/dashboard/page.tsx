import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Edit, NotebookIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DeleteNote } from "@/components/SubmitButton";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

async function getData(userId: string) {
  noStore();
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      Notes: true,
      Subscription: {
        select: {
          status: true,
        },
      },
    },
  });
  return data;
}
export default async function Dashboard() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  async function deleteNote(formData: FormData) {
    "use server";
    const noteId = formData.get("noteId") as string;
    await prisma.notes.delete({
      where: {
        id: noteId,
      },
    });
    revalidatePath("/dashboard");
  }
  return (
    <div className="grid items-start gap-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl">Notes</h1>
          <p className="text-lg text-muted-foreground">
            Hare You can see and create new notes
          </p>
        </div>
        <div>
          {data?.Subscription?.status === "active" ? (
            // Jika status subscription aktif, user bisa membuat note tanpa batas
            <Button asChild>
              <Link href={"/dashboard/new"}>Create a new Note</Link>
            </Button>
          ) : // Cek apakah data.notes didefinisikan dan jika jumlah notes sudah mencapai 5, arahkan ke halaman billing
          Array.isArray(data?.Notes) && data?.Notes.length >= 5 ? (
            <Button asChild>
              <Link href={"/dashboard/billings"}>Subscription required</Link>
            </Button>
          ) : (
            // Jika belum mencapai 5 notes, user bisa membuat note baru
            <Button asChild>
              <Link href={"/dashboard/new"}>Create a new Note</Link>
            </Button>
          )}
        </div>
      </div>
      {data?.Notes.length == 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <NotebookIcon className="w-10 h-10 text-primary" />
          </div>
          <p className="mt-6 text-semibold text-xl mx-auto text-center">
            You dont have any notes created!
          </p>
          <p className="mt-3 text-muted-foreground text-lg mx-auto text-center">
            You currently dont have any notes. please create some so that you
            can see them right here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-y-4 mb-8">
          {data?.Notes.map((item) => (
            <Card
              key={item.id}
              className="flex items-center justify-between p-4"
            >
              <div className="">
                <h2 className="font-semibold text-lg text-primary">
                  {item.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                <p className="text-sm mt-2">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                  }).format(new Date(item.createdAt))}
                </p>
              </div>
              <div className="flex gap-x-4">
                <Link href={`/dashboard/new/${item.id}`}>
                  <Button variant={"outline"} size={"icon"}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <form action={deleteNote}>
                  <input type="hidden" name="noteId" value={item.id} />
                  <Button variant={"destructive"} size={"icon"} type="submit">
                    <DeleteNote />
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
