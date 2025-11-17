import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MessageCircle, Plus, Edit, Trash2, ExternalLink } from "lucide-react";

export function WhatsAppGroupsManager() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    courseLevel: "beginner" as "beginner" | "intermediary" | "proficient",
    timeSlot: "11AM_GMT" as "11AM_GMT" | "11AM_CST",
    groupName: "",
    groupLink: "",
    isActive: 1,
  });

  const utils = trpc.useUtils();
  const { data: groups, isLoading } = trpc.whatsapp.getAll.useQuery();

  const upsertMutation = trpc.whatsapp.upsert.useMutation({
    onSuccess: () => {
      toast.success(editingId ? "Group updated successfully!" : "Group added successfully!");
      utils.whatsapp.getAll.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to save group: " + error.message);
    },
  });

  const deleteMutation = trpc.whatsapp.delete.useMutation({
    onSuccess: () => {
      toast.success("Group deleted successfully!");
      utils.whatsapp.getAll.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to delete group: " + error.message);
    },
  });

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      courseLevel: "beginner",
      timeSlot: "11AM_GMT",
      groupName: "",
      groupLink: "",
      isActive: 1,
    });
  };

  const handleEdit = (group: any) => {
    setIsEditing(true);
    setEditingId(group.id);
    setFormData({
      courseLevel: group.courseLevel,
      timeSlot: group.timeSlot,
      groupName: group.groupName,
      groupLink: group.groupLink,
      isActive: group.isActive,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.groupLink.startsWith("https://chat.whatsapp.com/")) {
      toast.error("Please enter a valid WhatsApp group invite link");
      return;
    }

    upsertMutation.mutate({
      id: editingId || undefined,
      courseLevel: formData.courseLevel,
      timeSlot: formData.timeSlot,
      groupName: formData.groupName,
      groupLink: formData.groupLink,
      isActive: formData.isActive,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this WhatsApp group link?")) {
      deleteMutation.mutate({ id });
    }
  };

  const courseLevelLabels = {
    beginner: "Beginner",
    intermediary: "Intermediary",
    proficient: "Proficient",
  };

  const timeSlotLabels = {
    "11AM_GMT": "11:00 AM GMT",
    "11AM_CST": "11:00 AM CST",
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit WhatsApp Group" : "Add WhatsApp Group"}</CardTitle>
          <CardDescription>
            Manage WhatsApp group links for each course level and time slot. Students will receive the appropriate link after enrollment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseLevel">Course Level</Label>
                <Select
                  value={formData.courseLevel}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, courseLevel: value })
                  }
                >
                  <SelectTrigger id="courseLevel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediary">Intermediary</SelectItem>
                    <SelectItem value="proficient">Proficient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSlot">Time Slot</Label>
                <Select
                  value={formData.timeSlot}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, timeSlot: value })
                  }
                >
                  <SelectTrigger id="timeSlot">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="11AM_GMT">11:00 AM GMT</SelectItem>
                    <SelectItem value="11AM_CST">11:00 AM CST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                value={formData.groupName}
                onChange={(e) =>
                  setFormData({ ...formData, groupName: e.target.value })
                }
                placeholder="e.g., Edo Beginner - GMT Morning Class"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupLink">WhatsApp Group Invite Link</Label>
              <Input
                id="groupLink"
                value={formData.groupLink}
                onChange={(e) =>
                  setFormData({ ...formData, groupLink: e.target.value })
                }
                placeholder="https://chat.whatsapp.com/..."
                required
              />
              <p className="text-xs text-muted-foreground">
                Get the invite link from WhatsApp: Group Info → Invite via Link
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={upsertMutation.isPending}>
                {isEditing ? (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Update Group
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Group
                  </>
                )}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Existing Groups */}
      <Card>
        <CardHeader>
          <CardTitle>Configured WhatsApp Groups</CardTitle>
          <CardDescription>
            {groups?.length || 0} group{groups?.length !== 1 ? "s" : ""} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading groups...</p>
          ) : groups && groups.length > 0 ? (
            <div className="space-y-4">
              {groups.map((group) => (
                <Card key={group.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold">{group.groupName}</h3>
                          {group.isActive === 0 && (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary">
                            {courseLevelLabels[group.courseLevel as keyof typeof courseLevelLabels]}
                          </Badge>
                          <Badge variant="outline">
                            {timeSlotLabels[group.timeSlot as keyof typeof timeSlotLabels]}
                          </Badge>
                        </div>
                        <a
                          href={group.groupLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          View Group Link
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(group.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(group)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(group.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No WhatsApp groups configured yet</p>
              <p className="text-sm text-muted-foreground">
                Add group links above to automatically include them in enrollment emails
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-muted">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-2">How it works:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Create a WhatsApp group for each course level and time slot combination</li>
            <li>• Get the invite link from WhatsApp (Group Info → Invite via Link)</li>
            <li>• Add the link here - it will be automatically included in enrollment confirmation emails</li>
            <li>• Students will receive the appropriate group link based on their course and time slot selection</li>
            <li>• You can update or deactivate group links at any time</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
