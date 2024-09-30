import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function Navbar() {
  const { isAuthenticated } = getKindeServerSession();
  return (
    <nav className="border-b bg-background h-[10vh] flex items-center mx-5">
      <div className="container flex items-center justify-between">
        <Link href={"/"}>
          <h1 className="font-bold text-3xl">NotesApp</h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-5">
        <ThemeToggle />
      </div>
      {(await isAuthenticated()) ? (
        <LogoutLink>
          <Button>Logout</Button>
        </LogoutLink>
      ) : (
        <div className="flex items-center gap-x-5">
          <LoginLink>
            <Button variant={"secondary"}>SignIn</Button>
          </LoginLink>
        </div>
      )}
    </nav>
  );
}
