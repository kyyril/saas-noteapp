import { DashboardNav } from "@/components/DashboardNavbar";
import { ReactNode } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { get } from "http";
import { redirect } from "next/navigation";

export default async function LayoutDashboard({
  children,
}: {
  children: ReactNode;
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect("/");
  }
  return (
    <div className="flex flex-col space-y-6 mt-10 mx-2">
      <div className="container flex flex-1 gap-12 md:grid-cols-[200px_fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
