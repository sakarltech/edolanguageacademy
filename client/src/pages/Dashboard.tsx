import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { BookOpen, Video, FileText, Award, CheckCircle2, Circle, Calendar, Clock, Users, LogOut, Upload, File, X } from "lucide-react";
import { toast } from "sonner";
import { ALL_CURRICULA } from "@shared/curriculum";
import { getNextCohortStartDate } from "@shared/scheduleUtils";
import { useState, useRef } from "react";

// Assessment Upload Component
function AssessmentUpload({ enrollmentId, moduleNumber }: { enrollmentId: number; moduleNumber: number }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const utils = trpc.useUtils();

  const uploadMutation = trpc.student.uploadAssessment.useMutation({
    onSuccess: () => {
      toast.success("Assessment uploaded successfully!");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      utils.student.getModuleAssessments.invalidate({ enrollmentId, moduleNumber });
      setUploading(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload assessment");
      setUploading(false);
    },
  });

  const { data: submissions, isLoading: loadingSubmissions } = trpc.student.getModuleAssessments.useQuery(
    { enrollmentId, moduleNumber },
    { enabled: enrollmentId > 0 }
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string;
      const base64String = base64Data.split(',')[1]; // Remove data:type;base64, prefix

      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase() || 'pdf';

      uploadMutation.mutate({
        enrollmentId,
        moduleNumber,
        fileName: selectedFile.name,
        fileData: base64String,
        fileType: fileExtension,
        fileSize: selectedFile.size,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
          id={`file-upload-${moduleNumber}`}
        />
        
        {!selectedFile ? (
          <div>
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload your completed assessment or workbook
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <File className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1"
              >
                {uploading ? "Uploading..." : "Upload Assessment"}
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Change File
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Submission History */}
      {loadingSubmissions ? (
        <p className="text-sm text-muted-foreground text-center py-4">Loading submissions...</p>
      ) : submissions && submissions.length > 0 ? (
        <div>
          <h4 className="text-sm font-semibold mb-3">Previous Submissions</h4>
          <div className="space-y-2">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{submission.fileName}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatDate(submission.createdAt)}</span>
                      <span>•</span>
                      <span>{formatFileSize(submission.fileSize)}</span>
                      <span>•</span>
                      <Badge variant={submission.status === 'graded' ? 'default' : submission.status === 'reviewed' ? 'secondary' : 'outline'} className="text-xs">
                        {submission.status}
                      </Badge>
                      {submission.score !== null && (
                        <>
                          <span>•</span>
                          <span className="font-medium">Score: {submission.score}/100</span>
                        </>
                      )}
                    </div>
                    {submission.feedback && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        Feedback: {submission.feedback}
                      </p>
                    )}
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          No submissions yet. Upload your first assessment above!
        </p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const { data: enrollments, isLoading: enrollmentsLoading, refetch: refetchEnrollments } = trpc.student.getMyEnrollments.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<"beginner" | "intermediary" | "proficient" | null>(null);
  const [timeSlot, setTimeSlot] = useState<"11AM_GMT" | "11AM_CST">("11AM_GMT");
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const activeEnrollment = enrollments?.find((e) => e.status === "paid" || e.status === "active");
  
  const { data: progress } = trpc.student.getMyProgress.useQuery(
    { enrollmentId: activeEnrollment?.id || 0 },
    { enabled: !!activeEnrollment }
  );

  const { data: materials } = trpc.student.getCourseMaterials.useQuery(
    { courseLevel: (activeEnrollment?.courseLevel as "beginner" | "intermediary" | "proficient") || "beginner" },
    { enabled: !!activeEnrollment }
  );

  const toggleModuleCompletion = trpc.student.toggleModuleCompletion.useMutation({
    onSuccess: () => {
      toast.success("Progress updated!");
    },
  });

  const createCheckout = trpc.enrollment.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create checkout session");
    },
  });

  const handleOpenEnrollDialog = (courseLevel: "beginner" | "intermediary" | "proficient") => {
    setSelectedCourse(courseLevel);
    setEnrollDialogOpen(true);
  };

  const handleConfirmEnrollment = () => {
    if (!user || !selectedCourse) return;
    
    if (!phone.trim()) {
      toast.error("Please provide a phone number");
      return;
    }
    
    createCheckout.mutate({
      courseLevel: selectedCourse,
      learnerName: user.name || "",
      parentName: "",
      email: user.email || "",
      phone: phone.trim(),
      whatsappNumber: whatsappNumber.trim() || phone.trim(),
      timeSlot,
    });
    
    setEnrollDialogOpen(false);
  };

  if (loading || enrollmentsLoading) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Login Required</CardTitle>
              <CardDescription>Please log in to access your dashboard</CardDescription>
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

  // State 1: No active enrollment - show course catalog
  if (!activeEnrollment) {
    const courses = [
      {
        level: "Beginner",
        courseLevel: "beginner" as const,
        icon: BookOpen,
        price: "£19.99",
        description: "Perfect for absolute beginners. Learn the Edo alphabet, basic greetings, numbers, and everyday vocabulary through bi-weekly live classes.",
        features: [
          "4 modules over 8 weeks",
          "60-minute live classes",
          "Teaching notes & recordings",
          "Certificate upon completion",
        ],
      },
      {
        level: "Intermediary",
        courseLevel: "intermediary" as const,
        icon: Users,
        price: "£24.99",
        description: "Build on your basics. Form sentences, ask questions, and explore Edo culture with advanced grammar and proverbs.",
        features: [
          "4 modules over 8 weeks",
          "60-minute live classes",
          "Teaching notes & recordings",
          "Certificate upon completion",
        ],
      },
      {
        level: "Proficient",
        courseLevel: "proficient" as const,
        icon: Award,
        price: "£29.99",
        description: "Achieve fluency. Master advanced grammar, cultural expressions, and confident communication in reading, writing, and conversation.",
        features: [
          "4 modules over 8 weeks",
          "60-minute live classes",
          "Teaching notes & recordings",
          "Certificate upon completion",
        ],
      },
    ];

    const nextCohort = getNextCohortStartDate();

    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Message */}
            <div className="text-center mb-12">
              <div className="flex justify-end mb-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    await logout();
                    window.location.href = getLoginUrl();
                  }}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
              <h1 className="text-4xl font-display font-bold mb-4">
                Welcome, {user?.name?.split(" ")[0] || "Learner"}!
              </h1>
              <p className="text-lg text-muted-foreground">
                You haven't enrolled in a course yet. Start by choosing your level below.
              </p>
            </div>

            {/* Next Cohort Info */}
            <Card className="mb-8 bg-primary/5 border-primary/20">
              <CardContent className="flex items-center gap-4 py-4">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Next Cohort Starts</p>
                  <p className="text-sm text-muted-foreground">
                    {nextCohort.toLocaleDateString("en-GB", { 
                      weekday: "long", 
                      year: "numeric", 
                      month: "long", 
                      day: "numeric" 
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Course Catalog */}
            <div className="grid md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.courseLevel} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <course.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Edo {course.level}</CardTitle>
                        <p className="text-2xl font-bold text-primary">{course.price}</p>
                      </div>
                    </div>
                    <CardDescription className="text-sm">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-2 mb-6 flex-1">
                      {course.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      onClick={() => handleOpenEnrollDialog(course.courseLevel)}
                    >
                      Enrol Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Class Schedule Info */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Class Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose your preferred time slot during enrollment. All classes are 60 minutes, twice per week for 8 weeks.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="font-semibold mb-1">Time Slot 1</p>
                    <p className="text-sm text-muted-foreground">11:00 AM GMT (UK Time)</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="font-semibold mb-1">Time Slot 2</p>
                    <p className="text-sm text-muted-foreground">11:00 AM CST (US Central)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enrollment Dialog */}
        <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Complete Your Enrollment</DialogTitle>
              <DialogDescription>
                Please provide a few details to complete your enrollment in Edo {selectedCourse?.charAt(0).toUpperCase()}{selectedCourse?.slice(1)}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Time Slot Selection */}
              <div className="space-y-3">
                <Label>Preferred Class Time *</Label>
                <RadioGroup value={timeSlot} onValueChange={(value) => setTimeSlot(value as "11AM_GMT" | "11AM_CST")}>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="11AM_GMT" id="gmt" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="gmt" className="font-medium cursor-pointer">
                        11:00 AM GMT (UK Time)
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Best for learners in UK, Nigeria, and Central Europe
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="11AM_CST" id="cst" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="cst" className="font-medium cursor-pointer">
                        11:00 AM CST (US Central)
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Best for learners in North America
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+44 123 456 7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  We'll use this to contact you about class updates
                </p>
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number (Optional)</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+44 123 456 7890"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  If different from phone number. We'll send you the class WhatsApp group link.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEnrollDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmEnrollment}
                disabled={createCheckout.isPending}
              >
                {createCheckout.isPending ? "Processing..." : "Continue to Payment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Layout>
    );
  }

  // State 2: Has active enrollment - show enrolled course content
  const completedModules = progress?.progress?.completedModules?.split(",").filter(Boolean).map(Number) || [];
  const progressPercentage = (completedModules.length / 4) * 100;
  
  const courseCurriculum = ALL_CURRICULA[activeEnrollment.courseLevel as keyof typeof ALL_CURRICULA];
  
  // Group materials by module
  const materialsByModule = materials?.reduce((acc, material) => {
    if (!acc[material.moduleNumber]) {
      acc[material.moduleNumber] = [];
    }
    acc[material.moduleNumber].push(material);
    return acc;
  }, {} as Record<number, typeof materials>) || {};

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Logout Button */}
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={async () => {
                await logout();
                window.location.href = getLoginUrl();
              }}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {/* Active Course Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="mb-2">Active Course</Badge>
                  <CardTitle className="text-2xl font-display">
                    Edo {activeEnrollment.courseLevel.charAt(0).toUpperCase() + activeEnrollment.courseLevel.slice(1)}
                  </CardTitle>
                  <CardDescription>
                    Complete all 4 modules to master this level
                  </CardDescription>
                </div>
                {progress?.progress?.certificateUrl && (
                  <Button asChild variant="outline">
                    <a href={progress.progress.certificateUrl} target="_blank" rel="noopener noreferrer">
                      <Award className="h-4 w-4 mr-2" />
                      View Certificate
                    </a>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Course Progress</span>
                  <span className="text-muted-foreground">
                    {completedModules.length} of 4 modules completed
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Course Content - Modules */}
          <Tabs defaultValue="module-1" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              {[1, 2, 3, 4].map((moduleNum) => (
                <TabsTrigger key={moduleNum} value={`module-${moduleNum}`} className="relative">
                  <span>Module {moduleNum}</span>
                  {completedModules.includes(moduleNum) && (
                    <CheckCircle2 className="h-4 w-4 text-primary absolute -top-1 -right-1" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {[1, 2, 3, 4].map((moduleNum) => {
              const moduleInfo = courseCurriculum?.modules.find(m => m.moduleNumber === moduleNum);
              const moduleMaterials = materialsByModule[moduleNum] || [];
              const isCompleted = completedModules.includes(moduleNum);

              return (
                <TabsContent key={moduleNum} value={`module-${moduleNum}`} className="space-y-6">
                  {/* Module Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {moduleInfo?.title}
                            {isCompleted && (
                              <Badge variant="secondary" className="ml-2">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            Weeks {moduleInfo?.weeks.join(", ")}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`module-${moduleNum}-complete`}
                            checked={isCompleted}
                            onCheckedChange={() => {
                              if (activeEnrollment?.id) {
                                toggleModuleCompletion.mutate({
                                  enrollmentId: activeEnrollment.id,
                                  moduleNumber: moduleNum,
                                });
                              }
                            }}
                          />
                          <label
                            htmlFor={`module-${moduleNum}-complete`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            Mark as complete
                          </label>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <h4 className="font-semibold mb-2">Learning Outcomes:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {moduleInfo?.learningOutcomes.map((outcome, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Circle className="h-3 w-3 mt-1 flex-shrink-0" />
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Assessment Upload Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Submit Assessment</CardTitle>
                      <CardDescription>
                        Upload your completed workbook or assessment for Module {moduleNum}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AssessmentUpload 
                        enrollmentId={activeEnrollment?.id || 0}
                        moduleNumber={moduleNum}
                      />
                    </CardContent>
                  </Card>

                  {/* Module Materials */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Course Materials</CardTitle>
                      <CardDescription>
                        Access teaching notes, videos, and worksheets for this module
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {moduleMaterials.length > 0 ? (
                        <div className="space-y-3">
                          {moduleMaterials.map((material) => (
                            <div
                              key={material.id}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {material.type === "video" && <Video className="h-5 w-5 text-primary" />}
                                {material.type === "pdf" && <FileText className="h-5 w-5 text-primary" />}
                                {material.type === "worksheet" && <BookOpen className="h-5 w-5 text-primary" />}
                                <div>
                                  <p className="font-medium">{material.title}</p>
                                  {material.description && (
                                    <p className="text-sm text-muted-foreground">{material.description}</p>
                                  )}
                                </div>
                              </div>
                              <Button asChild variant="outline" size="sm">
                                <a href={material.fileUrl || "#"} target="_blank" rel="noopener noreferrer">
                                  View
                                </a>
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No materials available yet. Check back soon!
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>

          {/* One-level-at-a-time Notice */}
          <Card className="mt-8 bg-muted/50">
            <CardContent className="py-6">
              <p className="text-sm text-center text-muted-foreground">
                <strong>Note:</strong> You can only enrol in one level at a time. Complete this course to unlock the next level.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
