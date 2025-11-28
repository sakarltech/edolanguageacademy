import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { format } from "date-fns";

export default function AdminAnnouncements() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    daysActive: 7,
  });

  const utils = trpc.useUtils();
  const { data: announcements, isLoading } = trpc.announcement.getAll.useQuery();
  
  const createMutation = trpc.announcement.create.useMutation({
    onSuccess: () => {
      toast.success("Announcement created successfully");
      utils.announcement.getAll.invalidate();
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create announcement");
    },
  });

  const updateMutation = trpc.announcement.update.useMutation({
    onSuccess: () => {
      toast.success("Announcement updated successfully");
      utils.announcement.getAll.invalidate();
      setIsEditDialogOpen(false);
      setEditingAnnouncement(null);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update announcement");
    },
  });

  const deleteMutation = trpc.announcement.delete.useMutation({
    onSuccess: () => {
      toast.success("Announcement deleted successfully");
      utils.announcement.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete announcement");
    },
  });

  const toggleActiveMutation = trpc.announcement.toggleActive.useMutation({
    onSuccess: () => {
      toast.success("Announcement status updated");
      utils.announcement.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      daysActive: 7,
    });
  };

  const handleCreate = () => {
    if (!formData.title || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleEdit = (announcement: any) => {
    setEditingAnnouncement(announcement);
    
    // Calculate days remaining
    const now = new Date();
    const expiresAt = new Date(announcement.expiresAt);
    const daysRemaining = Math.max(1, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    
    setFormData({
      title: announcement.title,
      message: announcement.message,
      daysActive: daysRemaining,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingAnnouncement || !formData.title || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    updateMutation.mutate({
      id: editingAnnouncement.id,
      ...formData,
      isActive: editingAnnouncement.isActive === 1,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleToggleActive = (id: number, currentStatus: number) => {
    toggleActiveMutation.mutate({
      id,
      isActive: currentStatus === 0,
    });
  };

  const isExpired = (expiresAt: string | Date) => {
    const expDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
    return expDate < new Date();
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl">Manage Announcements</CardTitle>
              <CardDescription>Create and manage scrolling announcements for the homepage</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>
                    Add a new announcement to display on the homepage banner
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., New Course Starting Soon!"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Enter the announcement message..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="daysActive">Days to Display</Label>
                    <Input
                      id="daysActive"
                      type="number"
                      min="1"
                      max="365"
                      value={formData.daysActive}
                      onChange={(e) => setFormData({ ...formData, daysActive: parseInt(e.target.value) || 1 })}
                    />
                    <p className="text-sm text-muted-foreground">
                      Announcement will expire on {format(new Date(Date.now() + formData.daysActive * 24 * 60 * 60 * 1000), "PPP")}
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create Announcement"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading announcements...</div>
          ) : !announcements || announcements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No announcements yet. Create your first one!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell className="font-medium">{announcement.title}</TableCell>
                    <TableCell className="max-w-md truncate">{announcement.message}</TableCell>
                    <TableCell>
                      {isExpired(announcement.expiresAt) ? (
                        <Badge variant="secondary">Expired</Badge>
                      ) : announcement.isActive === 1 ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(announcement.expiresAt), "PPP")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(announcement.id, announcement.isActive)}
                          disabled={toggleActiveMutation.isPending || isExpired(announcement.expiresAt)}
                          title={announcement.isActive === 1 ? "Deactivate" : "Activate"}
                        >
                          {announcement.isActive === 1 ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(announcement)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(announcement.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Update the announcement details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-message">Message</Label>
              <Textarea
                id="edit-message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-daysActive">Days to Display (from now)</Label>
              <Input
                id="edit-daysActive"
                type="number"
                min="1"
                max="365"
                value={formData.daysActive}
                onChange={(e) => setFormData({ ...formData, daysActive: parseInt(e.target.value) || 1 })}
              />
              <p className="text-sm text-muted-foreground">
                Announcement will expire on {format(new Date(Date.now() + formData.daysActive * 24 * 60 * 60 * 1000), "PPP")}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Announcement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
