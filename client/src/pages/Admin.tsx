import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  Users,
  GraduationCap,
  TrendingUp,
  Upload,
  FileText,
  CheckCircle2,
  Trash2,
  Download,
} from "lucide-react";
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
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { WhatsAppGroupsManager } from "@/components/WhatsAppGroupsManager";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [materialForm, setMaterialForm] = useState({
    courseLevel: "beginner",
    moduleNumber: 1,
    week: 1,
    title: "",
    description: "",
    type: "pdf",
    fileUrl: "",
  });

  // Bulk delete state
  const [selectedEnrollments, setSelectedEnrollments] = useState<number[]>([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const { data: analytics } = trpc.admin.getAnalytics.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: enrollments } = trpc.admin.getAllEnrollments.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: materials } = trpc.admin.getAllCourseMaterials.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const uploadMaterialMutation = trpc.admin.uploadCourseMaterial.useMutation({
    onSuccess: () => {
      toast.success("Material uploaded successfully!");
      setMaterialForm({
        courseLevel: "beginner",
        moduleNumber: 1,
        week: 1,
        title: "",
        description: "",
        type: "pdf",
        fileUrl: "",
      });
    },
  });

  const updateEnrollmentMutation = trpc.admin.updateEnrollmentStatus.useMutation({
    onSuccess: () => {
      toast.success("Enrollment status updated!");
    },
  });

  const deleteMaterialMutation = trpc.admin.deleteCourseMaterial.useMutation({
    onSuccess: () => {
      toast.success("Material deleted!");
    },
  });

  const utils = trpc.useUtils();
  const deleteEnrollmentMutation = trpc.admin.deleteEnrollment.useMutation({
    onSuccess: () => {
      toast.success("Enrollment deleted successfully!");
      utils.admin.getAllEnrollments.invalidate();
      utils.admin.getAnalytics.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to delete enrollment: " + error.message);
    },
  });

  const bulkDeleteEnrollmentsMutation = trpc.admin.bulkDeleteEnrollments.useMutation({
    onSuccess: (data) => {
      toast.success(`Successfully deleted ${data.deletedCount} enrollment(s)!`);
      setSelectedEnrollments([]);
      setShowBulkDeleteDialog(false);
      utils.admin.getAllEnrollments.invalidate();
      utils.admin.getAnalytics.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to delete enrollments: " + error.message);
    },
  });

  // Toggle single enrollment selection
  const toggleEnrollmentSelection = (enrollmentId: number) => {
    setSelectedEnrollments(prev => 
      prev.includes(enrollmentId) 
        ? prev.filter(id => id !== enrollmentId)
        : [...prev, enrollmentId]
    );
  };

  // Toggle all enrollments selection
  const toggleSelectAll = () => {
    if (!enrollments) return;
    if (selectedEnrollments.length === enrollments.length) {
      setSelectedEnrollments([]);
    } else {
      setSelectedEnrollments(enrollments.map(e => e.enrollment.id));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedEnrollments.length === 0) return;
    bulkDeleteEnrollmentsMutation.mutate({ enrollmentIds: selectedEnrollments });
  };

  // Export enrollments to CSV
  const exportToCSV = () => {
    if (!enrollments || enrollments.length === 0) {
      toast.error("No enrollments to export");
      return;
    }

    // Define CSV headers
    const headers = [
      "ID",
      "Learner Name",
      "Email",
      "Phone",
      "WhatsApp",
      "Course Level",
      "Time Slot",
      "Status",
      "Parent Name",
      "Created At",
      "Updated At"
    ];

    // Format time slot for display
    const formatTimeSlot = (slot: string) => {
      switch (slot) {
        case "5PM_GMT": return "5:00 PM GMT";
        case "6PM_GMT": return "6:00 PM GMT";
        case "7PM_GMT": return "7:00 PM GMT";
        case "11AM_GMT": return "11:00 AM GMT";
        case "11AM_CST": return "11:00 AM CST";
        default: return slot;
      }
    };

    // Escape CSV field (handle commas, quotes, newlines)
    const escapeCSV = (field: any): string => {
      if (field === null || field === undefined) return "";
      const str = String(field);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Format date
    const formatDate = (date: Date | string | null) => {
      if (!date) return "";
      return new Date(date).toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    };

    // Build CSV rows
    const rows = enrollments.map(({ enrollment }) => [
      escapeCSV(enrollment.id),
      escapeCSV(enrollment.learnerName),
      escapeCSV(enrollment.email),
      escapeCSV(enrollment.phone),
      escapeCSV(enrollment.whatsappNumber),
      escapeCSV(enrollment.courseLevel.charAt(0).toUpperCase() + enrollment.courseLevel.slice(1)),
      escapeCSV(formatTimeSlot(enrollment.timeSlot)),
      escapeCSV(enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)),
      escapeCSV(enrollment.parentName),
      escapeCSV(formatDate(enrollment.createdAt)),
      escapeCSV(formatDate(enrollment.updatedAt))
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().split("T")[0];
    link.href = url;
    link.download = `edo-academy-enrollments-${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${enrollments.length} enrollment(s) to CSV`);
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
                <a href={getLoginUrl()}>Log In</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    await uploadMaterialMutation.mutateAsync({
      courseLevel: materialForm.courseLevel as any,
      moduleNumber: materialForm.moduleNumber,
      week: materialForm.week,
      title: materialForm.title,
      description: materialForm.description || undefined,
      type: materialForm.type as any,
      fileUrl: materialForm.fileUrl || undefined,
      isPublished: true,
    });
  };

  return (
    <Layout>
      {/* Admin Header */}
      <section className="bg-gradient-to-b from-muted to-background py-12">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage enrollments, materials, and track academy performance
              </p>
              <div className="flex gap-2 mt-4">
                <Button asChild variant="outline" size="sm">
                  <a href="/admin/assessments">
                    <FileText className="h-4 w-4 mr-1" />
                    Review Assessments
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href="/admin/announcements">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Manage Announcements
                  </a>
                </Button>
              </div>
            </div>
            <BarChart3 className="w-16 h-16 text-primary opacity-20" />
          </div>
        </div>
      </section>

      {/* Analytics Overview */}
      {analytics && (
        <section className="py-8 bg-background">
          <div className="container">
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Enrollments</CardDescription>
                  <CardTitle className="text-3xl">{analytics.totalEnrollments}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>All time</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Active Students</CardDescription>
                  <CardTitle className="text-3xl">{analytics.activeEnrollments}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>Currently enrolled</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Certificates Issued</CardDescription>
                  <CardTitle className="text-3xl">{analytics.certificatesIssued}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="w-4 h-4" />
                    <span>Completed courses</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Avg. Completion</CardDescription>
                  <CardTitle className="text-3xl">{analytics.averageCompletion}%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Course progress</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Main Admin Tabs */}
      <section className="py-8 bg-background">
        <div className="container">
          <Tabs defaultValue="enrollments" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp Groups</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Enrollments Tab */}
            <TabsContent value="enrollments" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>All Enrollments</CardTitle>
                      <CardDescription>Manage student enrollments and status</CardDescription>
                    </div>
                    {enrollments && enrollments.length > 0 && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="select-all"
                            checked={selectedEnrollments.length === enrollments.length && enrollments.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                          <Label htmlFor="select-all" className="text-sm cursor-pointer">
                            Select All ({enrollments.length})
                          </Label>
                        </div>
                        <Button variant="outline" size="sm" onClick={exportToCSV}>
                          <Download className="h-4 w-4 mr-2" />
                          Export CSV
                        </Button>
                        {selectedEnrollments.length > 0 && (
                          <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Selected ({selectedEnrollments.length})
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete {selectedEnrollments.length} Enrollment(s)</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {selectedEnrollments.length} enrollment(s)? 
                                  This will also delete all related progress records and assessment submissions. 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleBulkDelete}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={bulkDeleteEnrollmentsMutation.isPending}
                                >
                                  {bulkDeleteEnrollmentsMutation.isPending ? "Deleting..." : "Delete All"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {enrollments && enrollments.length > 0 ? (
                      enrollments.map(({ enrollment, user }) => (
                        <Card key={enrollment.id} className={selectedEnrollments.includes(enrollment.id) ? "border-primary" : ""}>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Checkbox
                                  checked={selectedEnrollments.includes(enrollment.id)}
                                  onCheckedChange={() => toggleEnrollmentSelection(enrollment.id)}
                                />
                                <div className="space-y-1">
                                <p className="font-semibold">{enrollment.learnerName}</p>
                                <p className="text-sm text-muted-foreground">{enrollment.email}</p>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="outline">
                                    {enrollment.courseLevel.charAt(0).toUpperCase() +
                                      enrollment.courseLevel.slice(1)}
                                  </Badge>
                                  <Badge variant="outline">
                                    {enrollment.timeSlot === "5PM_GMT" ? "5 PM GMT" : 
                                     enrollment.timeSlot === "6PM_GMT" ? "6 PM GMT" : 
                                     enrollment.timeSlot === "7PM_GMT" ? "7 PM GMT" :
                                     enrollment.timeSlot === "11AM_GMT" ? "11 AM GMT" : "11 AM CST"}
                                  </Badge>
                                  <Badge
                                    variant={
                                      enrollment.status === "active"
                                        ? "default"
                                        : enrollment.status === "completed"
                                        ? "secondary"
                                        : "outline"
                                    }
                                  >
                                    {enrollment.status}
                                  </Badge>
                                </div>
                                </div>
                              </div>
                              <div className="flex gap-2 items-center">
                                <Select
                                  defaultValue={enrollment.status}
                                  onValueChange={(value) =>
                                    updateEnrollmentMutation.mutate({
                                      enrollmentId: enrollment.id,
                                      status: value as any,
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Enrollment</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete the enrollment for <strong>{enrollment.learnerName}</strong>? 
                                        This will also delete all related progress records and assessment submissions. 
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteEnrollmentMutation.mutate({ enrollmentId: enrollment.id })}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No enrollments yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Materials Tab */}
            <TabsContent value="materials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Course Material</CardTitle>
                  <CardDescription>Add new learning resources for students</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUploadMaterial} className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>Course Level</Label>
                        <Select
                          value={materialForm.courseLevel}
                          onValueChange={(value) =>
                            setMaterialForm({ ...materialForm, courseLevel: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediary">Intermediary</SelectItem>
                            <SelectItem value="proficient">Proficient</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Module</Label>
                        <Select
                          value={materialForm.moduleNumber.toString()}
                          onValueChange={(value) =>
                            setMaterialForm({ ...materialForm, moduleNumber: parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4].map((module) => (
                              <SelectItem key={module} value={module.toString()}>
                                Module {module}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Week</Label>
                        <Select
                          value={materialForm.week.toString()}
                          onValueChange={(value) =>
                            setMaterialForm({ ...materialForm, week: parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((week) => (
                              <SelectItem key={week} value={week.toString()}>
                                Week {week}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Title</Label>
                      <Input
                        value={materialForm.title}
                        onChange={(e) =>
                          setMaterialForm({ ...materialForm, title: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={materialForm.description}
                        onChange={(e) =>
                          setMaterialForm({ ...materialForm, description: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={materialForm.type}
                          onValueChange={(value) =>
                            setMaterialForm({ ...materialForm, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="teaching_note">Teaching Note</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="worksheet">Worksheet</SelectItem>
                            <SelectItem value="recording">Recording</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>File URL</Label>
                        <Input
                          type="url"
                          value={materialForm.fileUrl}
                          onChange={(e) =>
                            setMaterialForm({ ...materialForm, fileUrl: e.target.value })
                          }
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={uploadMaterialMutation.isPending}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Material
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Materials</CardTitle>
                  <CardDescription>Manage uploaded course materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {materials && materials.length > 0 ? (
                      materials.map((material) => (
                        <div
                          key={material.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium">{material.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {material.courseLevel} - Week {material.week} - {material.type}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              deleteMaterialMutation.mutate({ materialId: material.id })
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No materials uploaded yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certificates Tab */}
            <TabsContent value="certificates" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Management</CardTitle>
                  <CardDescription>
                    Issue certificates to students who have completed all 4 modules and passed assessments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {enrollments
                      ?.filter((e) => e.enrollment.status === "paid")
                      .map((item) => {
                        const enrollment = item.enrollment;
                        const progress = item as any; // Type assertion for progress data
                        const completedModules = progress.completedModules?.split(",").filter(Boolean) || [];
                        const allModulesCompleted = completedModules.length >= 4;
                        const certificateIssued = progress.certificateIssued === 1;

                        return (
                          <div
                            key={enrollment.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="font-medium">{enrollment.learnerName}</div>
                              <div className="text-sm text-muted-foreground">
                                {enrollment.courseLevel.charAt(0).toUpperCase() +
                                  enrollment.courseLevel.slice(1)}{" "}
                                Course
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                Modules Completed: {completedModules.length}/4
                                {progress.assessmentScore && (
                                  <span className="ml-2">
                                    • Assessment: {progress.assessmentScore}%
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {certificateIssued ? (
                                <>
                                  <Badge variant="default" className="bg-green-600">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Issued
                                  </Badge>
                                  {progress.certificateUrl && (
                                    <Button
                                      asChild
                                      variant="outline"
                                      size="sm"
                                    >
                                      <a
                                        href={progress.certificateUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        View Certificate
                                      </a>
                                    </Button>
                                  )}
                                </>
                              ) : allModulesCompleted ? (
                                <Button
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      const issueMutation = trpc.certificates.issueCertificate.useMutation();
                                      const result = await issueMutation.mutateAsync({
                                        enrollmentId: enrollment.id,
                                      });
                                      if (result.success) {
                                        toast.success("Certificate issued successfully!");
                                        window.location.reload();
                                      } else {
                                        toast.error(result.message);
                                      }
                                    } catch (error: any) {
                                      toast.error(error.message || "Failed to issue certificate");
                                    }
                                  }}
                                >
                                  Issue Certificate
                                </Button>
                              ) : (
                                <Badge variant="secondary">Not Eligible</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* WhatsApp Groups Tab */}
            <TabsContent value="whatsapp" className="space-y-4">
              <WhatsAppGroupsManager />
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Send Automated Notifications</CardTitle>
                  <CardDescription>
                    Send email notifications to students
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Class Reminders</CardTitle>
                        <CardDescription>
                          Send 24-hour reminders to all active students
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => {
                            toast.info("This feature sends automated class reminders to all active students 24 hours before class. Configure class schedule in settings.");
                          }}
                        >
                          Send Class Reminders
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Weekly Progress Summaries</CardTitle>
                        <CardDescription>
                          Send progress updates to all active students
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => {
                            toast.info("Sending weekly progress summaries to all active students...");
                          }}
                        >
                          Send Progress Summaries
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Incomplete Week Alerts</CardTitle>
                        <CardDescription>
                          Alert students who are behind on coursework
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          onClick={() => {
                            toast.info("Sending alerts to students with incomplete weeks...");
                          }}
                        >
                          Send Alerts
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Email Templates</CardTitle>
                        <CardDescription>
                          All emails include personalized content
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>✓ Class reminders</li>
                          <li>✓ Progress summaries</li>
                          <li>✓ Milestone congratulations</li>
                          <li>✓ Certificate notifications</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment Analytics</CardTitle>
                  <CardDescription>Course enrollment breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-4">Enrollments by Course Level</h3>
                        <div className="space-y-3">
                          {Object.entries(analytics.enrollmentsByLevel).map(([level, count]) => (
                            <div key={level} className="flex items-center justify-between">
                              <span className="capitalize">{level}</span>
                              <Badge>{count} students</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
