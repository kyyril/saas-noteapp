import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { UserNav } from "./UserNav";
import { User } from "lucide-react";

export async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <nav className="border-b bg-background h-[10vh] flex items-center">
      <div className="container flex items-center justify-between">
        <Link href={"/"}>
          <h1 className="font-bold text-primary text-2xl">
            Notes<span className="text-secondary-foreground">App</span>
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-5">
        <ThemeToggle />
      </div>
      <div className="mx-4">
        {(await isAuthenticated()) ? (
          <UserNav
            name={user?.given_name as string}
            email={user?.email as string}
            image={user?.picture as string}
          />
        ) : (
          <div className="flex items-center gap-x-5 ">
            <LoginLink>
              <Button variant={"secondary"}>SignIn</Button>
            </LoginLink>
          </div>
        )}
      </div>
    </nav>
  );
}
