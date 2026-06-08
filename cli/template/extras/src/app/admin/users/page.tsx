"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/server/better-auth/client";
import {
  Ban,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  KeyRound,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserCog,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  role: string;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

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

const ITEMS_PER_PAGE = 25;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<
    "ban" | "unban" | "delete" | "role" | "password" | null
  >(null);
  const [newRole, setNewRole] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [userSessions, setUserSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authClient.admin.listUsers({
        query: {
          searchValue: search || undefined,
          searchField: "name",
          searchOperator: "contains",
          limit: ITEMS_PER_PAGE,
          offset: page * ITEMS_PER_PAGE,
          sortBy: "createdAt",
          sortDirection: "desc",
          ...(roleFilter !== "all"
            ? {
                filterField: "role",
                filterValue: roleFilter,
                filterOperator: "eq",
              }
            : {}),
        },
      });
      if (res.data) {
        setUsers(res.data.users as User[]);
        setTotal(res.data.total ?? 0);
      }
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((u) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return !u.banned;
    if (statusFilter === "banned") return !!u.banned;
    if (statusFilter === "unverified") return !u.emailVerified;
    return true;
  });

  const fetchUserSessions = async (userId: string) => {
    setSessionsLoading(true);
    try {
      const res = await authClient.admin.listUserSessions({ userId });
      if (res.data) {
        setUserSessions(res.data as Session[]);
      }
    } catch {
      setUserSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  };

  const openDetail = (user: User) => {
    setSelectedUser(user);
    setDetailOpen(true);
    fetchUserSessions(user.id);
  };

  const handleBan = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await authClient.admin.banUser({
        userId: selectedUser.id,
        banReason: "Administrative action",
      });
      toast.success("User banned");
      await fetchUsers();
      if (detailOpen) {
        const updated = users.find((u) => u.id === selectedUser.id);
        if (updated) setSelectedUser({ ...updated, banned: true });
      }
    } catch {
      toast.error("Failed to ban user");
    } finally {
      setActionLoading(false);
      setDialogAction(null);
    }
  };

  const handleUnban = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await authClient.admin.unbanUser({ userId: selectedUser.id });
      toast.success("User unbanned");
      await fetchUsers();
    } catch {
      toast.error("Failed to unban user");
    } finally {
      setActionLoading(false);
      setDialogAction(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await authClient.admin.removeUser({ userId: selectedUser.id });
      toast.success("User deleted");
      await fetchUsers();
      setDetailOpen(false);
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(false);
      setDialogAction(null);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    setActionLoading(true);
    try {
      await authClient.admin.setRole({
        userId: selectedUser.id,
        role: newRole,
      });
      toast.success("Role updated");
      await fetchUsers();
    } catch {
      toast.error("Failed to update role");
    } finally {
      setActionLoading(false);
      setDialogAction(null);
      setNewRole("");
    }
  };

  const handleSetPassword = async () => {
    if (!selectedUser || !newPassword) return;
    setActionLoading(true);
    try {
      await authClient.admin.setUserPassword({
        userId: selectedUser.id,
        newPassword,
      });
      toast.success("Password updated");
      setNewPassword("");
    } catch {
      toast.error("Failed to update password");
    } finally {
      setActionLoading(false);
      setDialogAction(null);
    }
  };

  const handleRevokeSession = async (sessionToken: string) => {
    try {
      await authClient.admin.revokeUserSession({ sessionToken });
      toast.success("Session revoked");
      if (selectedUser) fetchUserSessions(selectedUser.id);
    } catch {
      toast.error("Failed to revoke session");
    }
  };

  const handleImpersonate = async (userId: string) => {
    try {
      await authClient.admin.impersonateUser({ userId });
      toast.success("Impersonating user — redirecting...");
      window.location.href = "/";
    } catch {
      toast.error("Failed to impersonate user");
    }
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;

    setActionLoading(true);
    try {
      await authClient.admin.createUser({
        email,
        password,
        name,
        role,
      });
      toast.success("User created");
      setCreateOpen(false);
      await fetchUsers();
    } catch {
      toast.error("Failed to create user");
    } finally {
      setActionLoading(false);
    }
  };

  const openDialog = (user: User, action: typeof dialogAction) => {
    setSelectedUser(user);
    setDialogAction(action);
    if (action === "role") setNewRole(user.role ?? "user");
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) return name.slice(0, 2).toUpperCase();
    return email.slice(0, 2).toUpperCase();
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="max-w-6xl space-y-4">
      <Toaster />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground text-sm">{total} total users</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Role
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Joined
                      </TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-muted-foreground h-24 text-center"
                        >
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className="cursor-pointer"
                          onClick={() => openDetail(user)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-muted text-xs">
                                  {getInitials(user.name, user.email)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="truncate font-medium">
                                  {user.name || "Unnamed"}
                                </p>
                                <p className="text-muted-foreground truncate text-xs">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge
                              variant={
                                user.role === "admin" ? "default" : "secondary"
                              }
                            >
                              {user.role ?? "user"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.banned ? (
                              <Badge variant="destructive">Banned</Badge>
                            ) : !user.emailVerified ? (
                              <Badge
                                variant="outline"
                                className="text-amber-600"
                              >
                                Unverified
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-emerald-600"
                              >
                                Active
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground hidden text-sm md:table-cell">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => openDetail(user)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleImpersonate(user.id)}
                                >
                                  <UserRound className="mr-2 h-4 w-4" />
                                  Impersonate
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openDialog(user, "role")}
                                >
                                  <UserCog className="mr-2 h-4 w-4" />
                                  Change Role
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openDialog(user, "password")}
                                >
                                  <KeyRound className="mr-2 h-4 w-4" />
                                  Set Password
                                </DropdownMenuItem>
                                {user.banned ? (
                                  <DropdownMenuItem
                                    onClick={() => openDialog(user, "unban")}
                                  >
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Unban
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => openDialog(user, "ban")}
                                    className="text-destructive"
                                  >
                                    <Ban className="mr-2 h-4 w-4" />
                                    Ban
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => openDialog(user, "delete")}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    Showing {page * ITEMS_PER_PAGE + 1}-
                    {Math.min((page + 1) * ITEMS_PER_PAGE, total)} of {total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages - 1, p + 1))
                      }
                      disabled={page >= totalPages - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* User Detail Sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selectedUser && (
            <>
              <SheetHeader className="pb-4">
                <SheetTitle>User Details</SheetTitle>
              </SheetHeader>
              <Tabs defaultValue="overview">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="sessions" className="flex-1">
                    Sessions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-muted text-lg">
                        {getInitials(selectedUser.name, selectedUser.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-semibold">
                        {selectedUser.name || "Unnamed User"}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Role</p>
                      <Badge
                        variant={
                          selectedUser.role === "admin"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {selectedUser.role ?? "user"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      {selectedUser.banned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : (
                        <Badge variant="outline" className="text-emerald-600">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email Verified</p>
                      <p>{selectedUser.emailVerified ? "Yes" : "No"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p>
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Updated</p>
                      <p>
                        {new Date(selectedUser.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedUser.banReason && (
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Ban Reason</p>
                        <p>{selectedUser.banReason}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleImpersonate(selectedUser.id)}
                    >
                      <UserRound className="mr-2 h-4 w-4" />
                      Impersonate
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => openDialog(selectedUser, "role")}
                    >
                      <UserCog className="mr-2 h-4 w-4" />
                      Change Role
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDialog(selectedUser, "password")}
                    >
                      <KeyRound className="mr-2 h-4 w-4" />
                      Set Password
                    </Button>
                    {selectedUser.banned ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDialog(selectedUser, "unban")}
                      >
                        <UserCheck className="mr-2 h-4 w-4" />
                        Unban
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDialog(selectedUser, "ban")}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Ban
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openDialog(selectedUser, "delete")}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="sessions" className="mt-4">
                  {sessionsLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : userSessions.length === 0 ? (
                    <p className="text-muted-foreground py-4 text-sm">
                      No active sessions
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {userSessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between rounded-md border p-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {session.userAgent || "Unknown device"}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {session.ipAddress || "Unknown IP"}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Expires{" "}
                              {new Date(session.expiresAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRevokeSession(session.token)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create User Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>Add a new user to the system</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" defaultValue="user">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={actionLoading}>
                {actionLoading ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ban Dialog */}
      <Dialog
        open={dialogAction === "ban"}
        onOpenChange={() => setDialogAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Prevent {selectedUser?.email} from accessing the application.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogAction(null)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBan}
              disabled={actionLoading}
            >
              {actionLoading ? "Banning..." : "Ban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unban Dialog */}
      <Dialog
        open={dialogAction === "unban"}
        onOpenChange={() => setDialogAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unban User</DialogTitle>
            <DialogDescription>
              Restore access for {selectedUser?.email}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogAction(null)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleUnban} disabled={actionLoading}>
              {actionLoading ? "Unbanning..." : "Unban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={dialogAction === "delete"}
        onOpenChange={() => setDialogAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              This will permanently delete {selectedUser?.email}. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogAction(null)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              {actionLoading ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Dialog */}
      <Dialog
        open={dialogAction === "role"}
        onOpenChange={() => setDialogAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              Update role for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogAction(null)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleRoleChange} disabled={actionLoading}>
              {actionLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Dialog */}
      <Dialog
        open={dialogAction === "password"}
        onOpenChange={() => setDialogAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Password</DialogTitle>
            <DialogDescription>
              Set a new password for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogAction(null)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSetPassword} disabled={actionLoading}>
              {actionLoading ? "Saving..." : "Set Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
