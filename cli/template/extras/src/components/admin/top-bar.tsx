"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <header className="hidden lg:flex h-14 items-center border-b bg-background px-6">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/admin" className="flex items-center hover:text-foreground transition-colors">
          <Home className="h-3.5 w-3.5" />
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">{currentName}</span>
      </nav>
    </header>
  );
}
