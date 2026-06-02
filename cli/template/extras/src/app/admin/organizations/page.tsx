"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  MoreHorizontal,
  Plus,
  X,
  UserPlus,
  Mail,
  Trash2,
} from "lucide-react";

import { authClient } from "@/server/better-auth/client";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type Organization = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  metadata: Record<string, any> | null;
  createdAt: Date;
};

type Member = {
  id: string;
  userId: string;
  role: string;
  createdAt: Date;
};

type Invitation = {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: Date;
};

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOrg, setDetailOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const res = await authClient.organization.list();
      if (res.data) {
        setOrganizations(res.data as Organization[]);
      }
    } catch {
      toast.error("Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrgDetails = async (org: Organization) => {
    setDetailOrg(org);
    setDetailLoading(true);
    try {
      const membersRes = await authClient.organization.listMembers();
      if (membersRes.data) {
        setMembers(membersRes.data as Member[]);
      }
      const inviteRes = await authClient.organization.listInvitations();
      if (inviteRes.data) {
        setInvitations(inviteRes.data as Invitation[]);
      }
    } catch {
      setMembers([]);
      setInvitations([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    setActionLoading(true);
    try {
      await authClient.organization.create({ name, slug });
      toast.success("Organization created");
      setCreateOpen(false);
      await fetchOrganizations();
    } catch {
      toast.error("Failed to create organization");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!detailOrg) return;
    setActionLoading(true);
    try {
      await authClient.organization.delete({ organizationId: detailOrg.id });
      toast.success("Organization deleted");
      setDeleteDialog(false);
      setDetailOrg(null);
      await fetchOrganizations();
    } catch {
      toast.error("Failed to delete organization");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
          <p className="text-sm text-muted-foreground">
            {organizations.length} organizations
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Organization
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Slug</TableHead>
                        <TableHead className="hidden md:table-cell">Created</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {organizations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                            No organizations found
                          </TableCell>
                        </TableRow>
                      ) : (
                        organizations.map((org) => (
                          <TableRow
                            key={org.id}
                            className="cursor-pointer"
                            onClick={() => fetchOrgDetails(org)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                                  <Building2 className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{org.name}</p>
                                  {org.metadata?.plan && (
                                    <p className="text-xs text-muted-foreground">{org.metadata.plan}</p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                              {org.slug}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                              {new Date(org.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
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
        </div>

        {/* Detail Panel */}
        <div>
          {detailOrg ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>{detailOrg.name}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setDetailOrg(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>{detailOrg.slug}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Members</h4>
                  {detailLoading ? (
                    <Skeleton className="h-20 w-full" />
                  ) : members.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No members</p>
                  ) : (
                    <div className="space-y-2">
                      {members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between text-sm">
                          <span className="font-mono text-xs">{member.userId.slice(0, 8)}...</span>
                          <span className="text-xs capitalize">{member.role}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Invitations</h4>
                  {detailLoading ? (
                    <Skeleton className="h-20 w-full" />
                  ) : invitations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No pending invitations</p>
                  ) : (
                    <div className="space-y-2">
                      {invitations.map((invite) => (
                        <div key={invite.id} className="flex items-center justify-between text-sm">
                          <span className="truncate">{invite.email}</span>
                          <span className="text-xs text-muted-foreground">{invite.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => setDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Organization
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center p-8">
              <div className="text-center text-muted-foreground">
                <Building2 className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Select an organization to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Acme Inc" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" placeholder="acme-inc" required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={actionLoading}>
                {actionLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Organization</DialogTitle>
            <DialogDescription>
              This will permanently delete {detailOrg?.name} and all its data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
              {actionLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
