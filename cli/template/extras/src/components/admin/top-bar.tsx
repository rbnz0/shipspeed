"use client";

import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routeNames: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "Users",
  "/admin/sessions": "Sessions",
  "/admin/organizations": "Organizations",
  "/admin/security": "Security",
};

export function AdminTopBar() {
  const pathname = usePathname();
  const currentName = routeNames[pathname] ?? "Admin";

  return (
    <header className="bg-background hidden h-14 items-center border-b px-6 lg:flex">
      <nav className="text-muted-foreground flex items-center gap-1 text-sm">
        <Link
          href="/admin"
          className="hover:text-foreground flex items-center transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{currentName}</span>
      </nav>
    </header>
  );
}
