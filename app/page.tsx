import { Button } from "@/components/ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();
  if (await isAuthenticated()) {
    return redirect("/dashboard");
  }
  return (
    <section className="flex items-center justify-center h-[90vh]">
      <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-16 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <h1 className="text-3xl font-bold mt-8 tracking-tight lg:text-6xl">
              Create notes with ease
            </h1>
            <p className="max-w-3xl mx-auto mt-4 lg:text-xl text-sm text-muted-foreground">
              A simple, fast, and secure note-taking application to organize your daily thoughts and work.
            </p>
            <div className="flex justify-center">
              <RegisterLink>
                <Button
                  size={"lg"}
                  className="bg-primary mt-4 mx-auto font-semibold"
                >
                  Sign Up
                </Button>
              </RegisterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
