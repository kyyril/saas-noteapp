import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Edit, NotebookIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DeleteNoteDialog } from "@/components/DeleteNoteDialog";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { decrypt } from "@/lib/encryption";
import { recordAuditLog } from "@/lib/audit";

interface NoteRecord {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
  userId?: string | null;
}

async function getData(userId: string) {
  noStore();
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      Notes: {
        orderBy: {
          createdAt: "desc",
        },
      },
      Subscription: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!data) return null;

  // Decrypt descriptions in-memory for authenticated view
  const decryptedNotes: NoteRecord[] = data.Notes.map((note: NoteRecord) => ({
    ...note,
    description: decrypt(note.description),
  }));

  return {
    ...data,
    Notes: decryptedNotes,
  };
}

export default async function Dashboard() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  async function deleteNote(formData: FormData) {
    "use server";
    const { getUser: getAuthUser } = getKindeServerSession();
    const currentUser = await getAuthUser();

    if (!currentUser || !currentUser.id) {
      throw new Error("Unauthorized request");
    }

    const noteId = formData.get("noteId") as string;

    // Multi-tenant check: Scoped strictly to authenticated user to prevent IDOR
    const deleted = await prisma.notes.deleteMany({
      where: {
        id: noteId,
        userId: currentUser.id,
      },
    });

    if (deleted.count > 0) {
      await recordAuditLog({
        userId: currentUser.id,
        action: "NOTE_DELETED",
        details: `Deleted note ID: ${noteId}`,
      });
    }

    revalidatePath("/dashboard");
  }

  return (
    <div className="grid items-start gap-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl">Notes</h1>
          <p className="text-lg text-muted-foreground">
            Here you can see and create new notes
          </p>
        </div>
        <div>
          {data?.Subscription?.status === "active" ? (
            <Button asChild>
              <Link href={"/dashboard/new"}>Create a new Note</Link>
            </Button>
          ) : Array.isArray(data?.Notes) && data?.Notes.length >= 5 ? (
            <Button asChild>
              <Link href={"/dashboard/billings"}>Subscription required</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href={"/dashboard/new"}>Create a new Note</Link>
            </Button>
          )}
        </div>
      </div>

      {data?.Notes.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <NotebookIcon className="w-10 h-10 text-primary" />
          </div>
          <p className="mt-6 font-semibold text-xl mx-auto text-center">
            You don't have any notes created!
          </p>
          <p className="mt-3 text-muted-foreground text-lg mx-auto text-center">
            You currently don't have any notes. please create some so that you
            can see them right here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-y-4 mb-8">
          {data?.Notes.map((item: NoteRecord) => (
            <Card
              key={item.id}
              className="flex items-center justify-between p-4"
            >
              <div>
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
                <DeleteNoteDialog
                  noteId={item.id}
                  deleteNoteAction={deleteNote}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
