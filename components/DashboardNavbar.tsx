"use client";
import { cn } from "@/lib/utils";
import { CreditCardIcon, HomeIcon, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItem } from "./UserNav";

export function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav className="grid items-start gap-2">
      {navItem.map((item, index) => (
        <Link key={index} href={item.href}>
          <span
            className={cn(
              "group flex items-center rounded-sm px-3 py-2 text-sm font-medium hover:bg-accent",
              pathname === item.href ? "bg-accent" : "bg-transparent"
            )}
          >
            <item.icon className="mr-2 h-5 w-5 text-primary" />
            {item.name}
          </span>
        </Link>
      ))}
    </nav>
  );
}
