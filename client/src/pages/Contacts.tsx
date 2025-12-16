import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  Plus,
  Search,
  Download,
  Trash2,
  Edit,
  Users,
  Mail,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Contacts() {
  const { user, loading, isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [subscribedFilter, setSubscribedFilter] = useState<"all" | "subscribed" | "unsubscribed">("all");
  const [sortBy, setSortBy] = useState<"created" | "name_asc" | "name_desc" | "email_asc" | "email_desc">("created");
  const [page, setPage] = useState(1);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [importPreview, setImportPreview] = useState<any>(null);
  const [replaceAll, setReplaceAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newContact, setNewContact] = useState({
    email: "",
    firstName: "",
    lastName: "",
    tags: "",
    source: "",
  });

  const utils = trpc.useUtils();

  const { data: contactsData, isLoading: contactsLoading } = trpc.marketing.getContacts.useQuery(
    {
      search: search || undefined,
      tag: tagFilter === "all" ? undefined : tagFilter || undefined,
      source: sourceFilter === "all" ? undefined : sourceFilter || undefined,
      subscribed: subscribedFilter,
      sortBy,
      page,
      limit: 50,
    },
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const { data: filters } = trpc.marketing.getContactFilters.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const addContactMutation = trpc.marketing.addContact.useMutation({
    onSuccess: () => {
      toast.success("Contact added successfully!");
      setShowAddDialog(false);
      setNewContact({ email: "", firstName: "", lastName: "", tags: "", source: "" });
      utils.marketing.getContacts.invalidate();
      utils.marketing.getContactFilters.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateContactMutation = trpc.marketing.updateContact.useMutation({
    onSuccess: () => {
      toast.success("Contact updated successfully!");
      setShowEditDialog(false);
      setEditingContact(null);
      utils.marketing.getContacts.invalidate();
      utils.marketing.getContactFilters.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteContactMutation = trpc.marketing.deleteContact.useMutation({
    onSuccess: () => {
      toast.success("Contact deleted!");
      utils.marketing.getContacts.invalidate();
    },
  });

  const bulkDeleteMutation = trpc.marketing.bulkDeleteContacts.useMutation({
    onSuccess: (data) => {
      toast.success(`Deleted ${data.deletedCount} contact(s)`);
      setSelectedContacts([]);
      utils.marketing.getContacts.invalidate();
    },
  });

  const importContactsMutation = trpc.marketing.importContacts.useMutation({
    onSuccess: (data) => {
      toast.success(
        `Import complete: ${data.summary.inserted} added, ${data.summary.updated} updated`
      );
      setShowImportDialog(false);
      setImportPreview(null);
      setReplaceAll(false);
      utils.marketing.getContacts.invalidate();
      utils.marketing.getContactFilters.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim());
      
      if (lines.length < 2) {
        toast.error("CSV file must have a header row and at least one data row");
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const emailIndex = headers.findIndex((h) => h === "email");
      
      if (emailIndex === -1) {
        toast.error("CSV must have an 'email' column");
        return;
      }

      const firstNameIndex = headers.findIndex((h) => h === "first_name" || h === "firstname");
      const lastNameIndex = headers.findIndex((h) => h === "last_name" || h === "lastname");
      const tagsIndex = headers.findIndex((h) => h === "tags");
      const sourceIndex = headers.findIndex((h) => h === "source");

      const contacts = [];
      const invalidEmails: string[] = [];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
        const email = values[emailIndex];
        
        if (!email) continue;
        
        if (!emailRegex.test(email)) {
          invalidEmails.push(email);
          continue;
        }

        contacts.push({
          email,
          firstName: firstNameIndex >= 0 ? values[firstNameIndex] : undefined,
          lastName: lastNameIndex >= 0 ? values[lastNameIndex] : undefined,
          tags: tagsIndex >= 0 ? values[tagsIndex] : undefined,
          source: sourceIndex >= 0 ? values[sourceIndex] : undefined,
        });
      }

      setImportPreview({
        contacts,
        invalidEmails,
        totalRows: lines.length - 1,
      });
      setShowImportDialog(true);
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExport = () => {
    if (!contactsData?.contacts) return;

    const headers = ["email", "first_name", "last_name", "tags", "source", "subscribed", "created_at"];
    const rows = contactsData.contacts.map((c) => [
      c.email,
      c.firstName || "",
      c.lastName || "",
      c.tags || "",
      c.source || "",
      c.subscribed ? "yes" : "no",
      new Date(c.createdAt).toISOString(),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contacts-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Contacts exported!");
  };

  const toggleSelectAll = () => {
    if (!contactsData?.contacts) return;
    if (selectedContacts.length === contactsData.contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contactsData.contacts.map((c) => c.id));
    }
  };

  // Redirect if not admin
  if (!loading && (!isAuthenticated || user?.role !== "admin")) {
    return (
      <Layout>
        <div className="container py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Admin Access Required</CardTitle>
              <CardDescription>
                You need admin privileges to access this page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Contacts</h1>
            <p className="text-muted-foreground">
              Manage your marketing email contacts
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/campaigns">
                <Mail className="h-4 w-4 mr-2" />
                Campaigns
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{contactsData?.total || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Contacts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {contactsData?.contacts?.filter((c) => c.subscribed).length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Subscribed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <XCircle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {contactsData?.contacts?.filter((c) => !c.subscribed).length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Unsubscribed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Mail className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{filters?.tags?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Tags</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {filters?.tags?.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {filters?.sources?.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={subscribedFilter} onValueChange={(v: any) => setSubscribedFilter(v)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="subscribed">Subscribed</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Newest First</SelectItem>
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                  <SelectItem value="email_asc">Email (A-Z)</SelectItem>
                  <SelectItem value="email_desc">Email (Z-A)</SelectItem>
                </SelectContent>
              </Select>

              {/* Actions */}
              <div className="flex gap-2 ml-auto">
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Contact</DialogTitle>
                      <DialogDescription>
                        Add a new contact to your marketing list
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={newContact.email}
                          onChange={(e) =>
                            setNewContact({ ...newContact, email: e.target.value })
                          }
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>First Name</Label>
                          <Input
                            value={newContact.firstName}
                            onChange={(e) =>
                              setNewContact({ ...newContact, firstName: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Last Name</Label>
                          <Input
                            value={newContact.lastName}
                            onChange={(e) =>
                              setNewContact({ ...newContact, lastName: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Tags (comma-separated)</Label>
                        <Input
                          value={newContact.tags}
                          onChange={(e) =>
                            setNewContact({ ...newContact, tags: e.target.value })
                          }
                          placeholder="newsletter, student"
                        />
                      </div>
                      <div>
                        <Label>Source</Label>
                        <Input
                          value={newContact.source}
                          onChange={(e) =>
                            setNewContact({ ...newContact, source: e.target.value })
                          }
                          placeholder="website, referral"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => addContactMutation.mutate(newContact)}
                        disabled={!newContact.email || addContactMutation.isPending}
                      >
                        {addContactMutation.isPending ? "Adding..." : "Add Contact"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedContacts.length > 0 && (
              <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">
                  {selectedContacts.length} selected
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete {selectedContacts.length} Contact(s)</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete these contacts? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => bulkDeleteMutation.mutate({ ids: selectedContacts })}
                        className="bg-destructive text-destructive-foreground"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <Card>
          <CardContent className="pt-6">
            {contactsLoading ? (
              <div className="text-center py-8">Loading contacts...</div>
            ) : contactsData?.contacts?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No contacts found. Import a CSV or add contacts manually.
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedContacts.length === contactsData?.contacts?.length &&
                            contactsData?.contacts?.length > 0
                          }
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactsData?.contacts?.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedContacts.includes(contact.id)}
                            onCheckedChange={() => {
                              setSelectedContacts((prev) =>
                                prev.includes(contact.id)
                                  ? prev.filter((id) => id !== contact.id)
                                  : [...prev, contact.id]
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{contact.email}</TableCell>
                        <TableCell>
                          {contact.firstName || contact.lastName
                            ? `${contact.firstName || ""} ${contact.lastName || ""}`.trim()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {contact.tags ? (
                            <div className="flex flex-wrap gap-1">
                              {contact.tags.split(",").map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {tag.trim()}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{contact.source || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={contact.subscribed ? "default" : "secondary"}>
                            {contact.subscribed ? "Subscribed" : "Unsubscribed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingContact(contact);
                                setShowEditDialog(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {contact.email}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteContactMutation.mutate({ id: contact.id })}
                                    className="bg-destructive text-destructive-foreground"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {contactsData && contactsData.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Page {contactsData.page} of {contactsData.totalPages} ({contactsData.total} total)
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(contactsData.totalPages, p + 1))}
                        disabled={page === contactsData.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Contact</DialogTitle>
            </DialogHeader>
            {editingContact && (
              <div className="space-y-4 py-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editingContact.email}
                    onChange={(e) =>
                      setEditingContact({ ...editingContact, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={editingContact.firstName || ""}
                      onChange={(e) =>
                        setEditingContact({ ...editingContact, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={editingContact.lastName || ""}
                      onChange={(e) =>
                        setEditingContact({ ...editingContact, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Tags</Label>
                  <Input
                    value={editingContact.tags || ""}
                    onChange={(e) =>
                      setEditingContact({ ...editingContact, tags: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Source</Label>
                  <Input
                    value={editingContact.source || ""}
                    onChange={(e) =>
                      setEditingContact({ ...editingContact, source: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="subscribed"
                    checked={editingContact.subscribed === 1}
                    onCheckedChange={(checked) =>
                      setEditingContact({ ...editingContact, subscribed: checked ? 1 : 0 })
                    }
                  />
                  <Label htmlFor="subscribed">Subscribed</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  updateContactMutation.mutate({
                    id: editingContact.id,
                    email: editingContact.email,
                    firstName: editingContact.firstName,
                    lastName: editingContact.lastName,
                    tags: editingContact.tags,
                    source: editingContact.source,
                    subscribed: editingContact.subscribed === 1,
                  })
                }
                disabled={updateContactMutation.isPending}
              >
                {updateContactMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import Preview Dialog */}
        <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Import Contacts</DialogTitle>
              <DialogDescription>
                Review the import before proceeding
              </DialogDescription>
            </DialogHeader>
            {importPreview && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {importPreview.contacts.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Valid Contacts</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {importPreview.invalidEmails.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Invalid Emails</p>
                  </div>
                </div>

                {importPreview.invalidEmails.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-2">
                      Invalid emails (will be skipped):
                    </p>
                    <p className="text-xs text-red-600">
                      {importPreview.invalidEmails.slice(0, 5).join(", ")}
                      {importPreview.invalidEmails.length > 5 &&
                        ` and ${importPreview.invalidEmails.length - 5} more`}
                    </p>
                  </div>
                )}

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Default behavior: Upsert
                      </p>
                      <p className="text-xs text-yellow-700">
                        Existing contacts will be updated, new contacts will be added.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <Checkbox
                    id="replace-all"
                    checked={replaceAll}
                    onCheckedChange={(checked) => setReplaceAll(!!checked)}
                  />
                  <Label htmlFor="replace-all" className="text-sm text-red-800">
                    <strong>DANGER:</strong> Delete all existing contacts before import
                  </Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  importContactsMutation.mutate({
                    contacts: importPreview.contacts,
                    replaceAll,
                  })
                }
                disabled={importContactsMutation.isPending}
              >
                {importContactsMutation.isPending
                  ? "Importing..."
                  : `Import ${importPreview?.contacts?.length || 0} Contacts`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
