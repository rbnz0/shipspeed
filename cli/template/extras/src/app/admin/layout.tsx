import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopBar } from "@/components/admin/top-bar";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | ShipSpeed Admin",
  },
  description: "ShipSpeed admin dashboard for managing users, sessions, organizations, and security.",
};

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopBar />
        <main className="flex-1 p-4 pt-20 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
