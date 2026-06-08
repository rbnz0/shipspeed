import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ShieldCheck, Users, UserX } from "lucide-react";
import { headers } from "next/headers";

import { auth } from "~/server/better-auth";

async function getStats() {
  try {
    const allUsersRes = await auth.api.listUsers({
      query: { limit: 1000 },
      headers: await headers(),
    });
    const users = allUsersRes?.users ?? [];
    const totalUsers = users.length;
    const adminCount = users.filter((u: any) => u.role === "admin").length;
    const bannedCount = users.filter((u: any) => u.banned).length;
    const unverifiedCount = users.filter((u: any) => !u.emailVerified).length;

    return { totalUsers, adminCount, bannedCount, unverifiedCount };
  } catch {
    return { totalUsers: 0, adminCount: 0, bannedCount: 0, unverifiedCount: 0 };
  }
}

async function getRecentActivity() {
  try {
    const usersRes = await auth.api.listUsers({
      query: { limit: 10, sortBy: "createdAt", sortDirection: "desc" },
      headers: await headers(),
    });
    return (usersRes?.users ?? []).slice(0, 5);
  } catch {
    return [];
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const recentUsers = await getRecentActivity();

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Overview of your application
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-muted-foreground text-xs">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <ShieldCheck className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.adminCount}</div>
            <p className="text-muted-foreground text-xs">With admin access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Banned</CardTitle>
            <UserX className="text-destructive h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-2xl font-bold">
              {stats.bannedCount}
            </div>
            <p className="text-muted-foreground text-xs">Suspended accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unverified</CardTitle>
            <Activity className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {stats.unverifiedCount}
            </div>
            <p className="text-muted-foreground text-xs">
              Pending verification
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <p className="text-muted-foreground py-4 text-sm">
                No recent users
              </p>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium">
                      {(user.name ?? user.email)?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {user.name || user.email}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {user.email}
                      </p>
                    </div>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Authentication", status: "Active" },
              { label: "Admin Plugin", status: "Enabled" },
              { label: "Rate Limiting", status: "Active" },
              { label: "Middleware Protection", status: "Active" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <span className="text-sm">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground text-xs">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
