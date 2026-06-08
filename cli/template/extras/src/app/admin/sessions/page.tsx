"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authClient } from "@/server/better-auth/client";
import { Monitor, Search, Users, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Session = {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type User = {
  id: string;
  name: string | null;
  email: string;
};

export default function AdminSessionsPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    if (!search.trim()) {
      setUsers([]);
      return;
    }
    setUserLoading(true);
    try {
      const res = await authClient.admin.listUsers({
        query: {
          searchValue: search,
          searchField: "name",
          searchOperator: "contains",
          limit: 10,
        },
      });
      if (res.data) {
        setUsers((res.data.users ?? []) as User[]);
      }
    } catch {
      setUsers([]);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchSessions = async (userId: string) => {
    setSessionLoading(true);
    try {
      const res = await authClient.admin.listUserSessions({ userId });
      if (res.data) {
        setSessions(res.data as Session[]);
      }
    } catch {
      setSessions([]);
    } finally {
      setSessionLoading(false);
    }
  };

  const selectUser = (user: User) => {
    setSelectedUser(user);
    setUsers([]);
    setSearch("");
    fetchSessions(user.id);
  };

  const handleRevoke = async () => {
    if (!selectedSession) return;
    setActionLoading(true);
    try {
      await authClient.admin.revokeUserSession({
        sessionToken: selectedSession.token,
      });
      toast.success("Session revoked");
      if (selectedUser) fetchSessions(selectedUser.id);
    } catch {
      toast.error("Failed to revoke session");
    } finally {
      setActionLoading(false);
      setDialogOpen(false);
      setSelectedSession(null);
    }
  };

  const handleRevokeAll = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await authClient.admin.revokeAllUserSessions({ userId: selectedUser.id });
      toast.success("All sessions revoked");
      setSessions([]);
    } catch {
      toast.error("Failed to revoke sessions");
    } finally {
      setActionLoading(false);
    }
  };

  const formatUA = (ua: string | null) => {
    if (!ua) return "Unknown";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return "Browser";
  };

  return (
    <div className="max-w-6xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sessions</h1>
        <p className="text-muted-foreground text-sm">
          Search for a user to view and manage their sessions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find User</CardTitle>
          <CardDescription>Search by name or email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
              />
            </div>
            <Button onClick={fetchUsers} disabled={userLoading}>
              {userLoading ? "Searching..." : "Search"}
            </Button>
          </div>

          {users.length > 0 && (
            <div className="mt-4 rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="text-muted-foreground h-3.5 w-3.5" />
                          <span className="text-sm font-medium">
                            {user.name || "Unnamed"}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {user.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => selectUser(user)}
                        >
                          View Sessions
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedUser && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                Sessions for {selectedUser.name || selectedUser.email}
              </CardTitle>
              <CardDescription>
                {sessions.length} active sessions
              </CardDescription>
            </div>
            {sessions.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleRevokeAll}>
                Revoke All
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {sessionLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        IP Address
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Created
                      </TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-muted-foreground h-24 text-center"
                        >
                          No active sessions
                        </TableCell>
                      </TableRow>
                    ) : (
                      sessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="text-sm">
                            {formatUA(session.userAgent)}
                          </TableCell>
                          <TableCell className="text-muted-foreground hidden text-sm sm:table-cell">
                            {session.ipAddress || "Unknown"}
                          </TableCell>
                          <TableCell className="text-muted-foreground hidden text-sm md:table-cell">
                            {new Date(session.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(session.expiresAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedSession(session);
                                setDialogOpen(true);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Session</DialogTitle>
            <DialogDescription>
              This will immediately log the user out from this device.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRevoke}
              disabled={actionLoading}
            >
              {actionLoading ? "Revoking..." : "Revoke"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
