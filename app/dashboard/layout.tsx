import { DashboardNav } from "@/components/DashboardNavbar";
import { ReactNode } from "react";

export default function LayoutDashboard({ children }: { children: ReactNode }) {
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
