"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Users,
  Lock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { authClient } from "@/server/better-auth/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  role?: string;
  banned?: boolean | null;
};

export default function AdminSecurityPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authClient.admin.listUsers({ query: { limit: 1000 } });
        if (res.data) {
          setUsers((res.data.users ?? []) as User[]);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const bannedUsers = users.filter((u) => u.banned).length;
  const unverifiedUsers = users.filter((u) => !u.emailVerified).length;
  const adminUsers = users.filter((u) => u.role === "admin").length;

  const recommendations = [
    {
      status: unverifiedUsers > 0 ? ("warning" as const) : ("success" as const),
      title: "Email Verification",
      description:
        unverifiedUsers > 0
          ? `${unverifiedUsers} user${unverifiedUsers === 1 ? "" : "s"} haven't verified their email`
          : "All users have verified their email addresses",
    },
    {
      status: bannedUsers > 0 ? ("warning" as const) : ("success" as const),
      title: "Banned Accounts",
      description:
        bannedUsers > 0
          ? `${bannedUsers} account${bannedUsers === 1 ? "" : "s"} currently banned`
          : "No banned accounts",
    },
    {
      status: adminUsers > 3 ? ("warning" as const) : ("success" as const),
      title: "Admin Access",
      description:
        adminUsers > 3
          ? `${adminUsers} admin users — consider reviewing access`
          : `${adminUsers} admin user${adminUsers === 1 ? "" : "s"} — within safe limit`,
    },
  ];

  const recentSignups = users
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security</h1>
        <p className="text-sm text-muted-foreground">Security overview and recommendations</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalUsers}</p>
                    <p className="text-xs text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-destructive/10">
                    <Lock className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{bannedUsers}</p>
                    <p className="text-xs text-muted-foreground">Banned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-500/10">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{unverifiedUsers}</p>
                    <p className="text-xs text-muted-foreground">Unverified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-500/10">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalUsers - bannedUsers}</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Recommendations
            </CardTitle>
            <CardDescription>Security status and suggested actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              recommendations.map((rec) => (
                <div
                  key={rec.title}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  {rec.status === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{rec.title}</p>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Recent Signups
            </CardTitle>
            <CardDescription>Latest account registrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : recentSignups.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No recent signups</p>
            ) : (
              recentSignups.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{user.name || user.email || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
