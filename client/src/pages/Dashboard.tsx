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
import PrivateClassDashboard from "@/components/PrivateClassDashboard";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { BookOpen, Video, FileText, Award, CheckCircle2, Circle, Calendar, Clock, Users, User, LogOut, Upload, File, X } from "lucide-react";
import { toast } from "sonner";
import { ALL_CURRICULA } from "@shared/curriculum";
import { getNextCohortStartDate } from "@shared/scheduleUtils";
import { useState, useRef, useEffect } from "react";

// Welcome Dialog Component for First-Time Users
function WelcomeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Òb'okhian! Welcome to Edo Language Academy</DialogTitle>
          <DialogDescription>
            Let's get you started on your Edo language learning journey
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Welcome Message */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Getting Started</h3>
            <p className="text-sm text-muted-foreground">
              Welcome to your personalized learning dashboard! Here's everything you need to know to make the most of your Edo language learning experience.
            </p>
          </div>

          {/* Navigation Guide */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              How to Navigate Your Dashboard
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">1</div>
                <div>
                  <p className="font-medium">Enroll in a Course</p>
                  <p className="text-muted-foreground">Select your level (Beginner, Intermediary, or Proficient) and complete payment to access course materials.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">2</div>
                <div>
                  <p className="font-medium">Access Course Modules</p>
                  <p className="text-muted-foreground">Each course has 4 modules spread across 8 weeks. Click on any module to view lessons, videos, and materials.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">3</div>
                <div>
                  <p className="font-medium">Upload Assessments</p>
                  <p className="text-muted-foreground">Complete your workbook for each module and upload it (PDF, DOC, or images). You must upload assessments before marking modules complete.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">4</div>
                <div>
                  <p className="font-medium">Track Your Progress</p>
                  <p className="text-muted-foreground">Mark modules as complete after uploading assessments. Your progress bar shows completion percentage.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">5</div>
                <div>
                  <p className="font-medium">Join WhatsApp Group</p>
                  <p className="text-muted-foreground">After enrollment, you'll receive a WhatsApp group link to connect with instructors and fellow students.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">6</div>
                <div>
                  <p className="font-medium">Earn Your Certificate</p>
                  <p className="text-muted-foreground">Complete all modules and pass assessments to receive your official Edo Language Academy certificate.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Key Features</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <Video className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Live Classes</p>
                  <p className="text-muted-foreground text-xs">60-minute weekly sessions</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Course Materials</p>
                  <p className="text-muted-foreground text-xs">Downloadable resources</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Community</p>
                  <p className="text-muted-foreground text-xs">WhatsApp group support</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Award className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Certification</p>
                  <p className="text-muted-foreground text-xs">Official completion certificate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Class Schedule */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Class Schedule
            </h3>
            <p className="text-sm text-muted-foreground">
              Each level has its own dedicated class time every Saturday:
            </p>
            <div className="text-sm space-y-1">
              <p>• <strong>Beginner:</strong> 5:00 PM GMT</p>
              <p>• <strong>Intermediary:</strong> 6:00 PM GMT</p>
              <p>• <strong>Proficient:</strong> 7:00 PM GMT</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Pre-recorded videos for each module coming soon to your dashboard!
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">Got it, let's start learning!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
  const [selectedCourse, setSelectedCourse] = useState<"beginner" | "intermediary" | "proficient" | "private" | null>(null);
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phoneNumber: string): boolean => {
    // Supports international formats: +44 123 456 7890, (123) 456-7890, etc.
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,}$/;
    return phoneRegex.test(phoneNumber.trim());
  };
  
  // Welcome dialog state for first-time users
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Show welcome dialog for first-time users (check localStorage)
  useEffect(() => {
    if (isAuthenticated && user) {
      const hasSeenWelcome = localStorage.getItem('edo-academy-welcome-seen');
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, [isAuthenticated, user]);
  
  const handleCloseWelcome = () => {
    localStorage.setItem('edo-academy-welcome-seen', 'true');
    setShowWelcome(false);
  };

  const activeEnrollment = enrollments?.find((e) => e.status === "paid" || e.status === "active");
  
  const { data: progress } = trpc.student.getMyProgress.useQuery(
    { enrollmentId: activeEnrollment?.id || 0 },
    { enabled: !!activeEnrollment }
  );

  const { data: materials } = trpc.student.getCourseMaterials.useQuery(
    { courseLevel: (activeEnrollment?.courseLevel as "beginner" | "intermediary" | "proficient") || "beginner" },
    { enabled: !!activeEnrollment }
  );

  // Fetch all assessments for this enrollment (to check module completion requirements)
  const { data: allAssessments } = trpc.student.getMyAssessments.useQuery(
    { enrollmentId: activeEnrollment?.id || 0 },
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

  const handleOpenEnrollDialog = (courseLevel: "beginner" | "intermediary" | "proficient" | "private") => {
    setSelectedCourse(courseLevel);
    setEnrollDialogOpen(true);
  };

  const handleConfirmEnrollment = () => {
    if (!user || !selectedCourse) return;
    
    // Reset errors
    setPhoneError("");
    setEmailError("");
    
    let hasError = false;
    
    // Validate email
    if (!user.email || !user.email.trim()) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!validateEmail(user.email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }
    
    // Validate phone
    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      hasError = true;
    } else if (!validatePhone(phone)) {
      setPhoneError("Please enter a valid phone number (e.g., +44 123 456 7890)");
      hasError = true;
    }
    
    if (hasError) {
      toast.error("Please correct the errors before continuing");
      return;
    }
    
    createCheckout.mutate({
      courseLevel: selectedCourse,
      learnerName: user.name || "",
      parentName: "",
      email: user.email || "",
      phone: phone.trim(),
      whatsappNumber: whatsappNumber.trim() || phone.trim(),
      timeSlot: selectedCourse === 'beginner' ? '5PM_GMT' : selectedCourse === 'intermediary' ? '6PM_GMT' : '7PM_GMT',
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
      {
        level: "Private Class",
        courseLevel: "private" as const,
        icon: User,
        price: "£49.99",
        description: "Personalized one-on-one instruction tailored to your schedule, goals, and learning pace. Choose your frequency and timing.",
        features: [
          "8 one-hour private sessions",
          "Flexible schedule (1x or 2x per week)",
          "Customized curriculum",
          "Individual instructor attention",
        ],
      },
    ];

    const nextCohort = getNextCohortStartDate();

    return (
      <Layout>
        <WelcomeDialog open={showWelcome} onClose={handleCloseWelcome} />
        <div className="container py-16">
          <div className="max-w-6xl mx-auto">
            {/* Header with Name and Sign Out */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold">
                  Welcome, {user?.name?.split(" ")[0] || "Learner"}!
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Your learning dashboard
                </p>
              </div>
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
            
            {/* Welcome Message */}
            <div className="text-center mb-12">
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
                  Each level has its own dedicated class time. All classes are 60 minutes, every Saturday for 8 weeks.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="font-semibold mb-1">Beginner</p>
                    <p className="text-sm text-muted-foreground">5:00 PM GMT</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="font-semibold mb-1">Intermediary</p>
                    <p className="text-sm text-muted-foreground">6:00 PM GMT</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="font-semibold mb-1">Proficient</p>
                    <p className="text-sm text-muted-foreground">7:00 PM GMT</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  See <a href="/schedule" className="text-primary hover:underline">Schedule page</a> for timezone conversions
                </p>
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
              {/* Class Time Info */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-1">
                  Your Class Time: {selectedCourse === 'beginner' ? '5:00 PM GMT' : selectedCourse === 'intermediary' ? '6:00 PM GMT' : '7:00 PM GMT'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Every Saturday • 60 minutes • See <a href="/schedule" className="text-primary hover:underline">Schedule page</a> for timezone conversions
                </p>
              </div>

              {/* Email Address (from user account) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className={emailError ? "border-destructive" : ""}
                />
                {emailError ? (
                  <p className="text-xs text-destructive">{emailError}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Email from your account. We'll send class updates and materials here.
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+44 123 456 7890"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError("");
                  }}
                  className={phoneError ? "border-destructive" : ""}
                  required
                />
                {phoneError ? (
                  <p className="text-xs text-destructive">{phoneError}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    We'll use this to contact you about class updates
                  </p>
                )}
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

  // State 2: Has active enrollment - check if it's a private class
  if (activeEnrollment.courseLevel === "private") {
    return (
      <Layout>
        <WelcomeDialog open={showWelcome} onClose={handleCloseWelcome} />
        <div className="container py-8">
          <div className="max-w-6xl mx-auto">
            <PrivateClassDashboard 
              enrollmentId={activeEnrollment.id} 
              learnerName={activeEnrollment.learnerName}
            />
          </div>
        </div>
      </Layout>
    );
  }

  // State 3: Has active enrollment for regular course - show enrolled course content
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
      <WelcomeDialog open={showWelcome} onClose={handleCloseWelcome} />
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with Name and Sign Out */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">
                Welcome back, {user?.name?.split(" ")[0] || "Learner"}!
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {activeEnrollment.courseLevel.charAt(0).toUpperCase() + activeEnrollment.courseLevel.slice(1)} Course
              </p>
            </div>
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
              
              // Check if this module has any submitted assessments
              const hasSubmittedAssessment = allAssessments?.some(a => a.moduleNumber === moduleNum) || false;

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
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`module-${moduleNum}-complete`}
                              checked={isCompleted}
                              disabled={!hasSubmittedAssessment}
                              onCheckedChange={() => {
                                if (activeEnrollment?.id) {
                                  if (!hasSubmittedAssessment) {
                                    toast.error("Please upload your assessment before marking this module as complete");
                                    return;
                                  }
                                  toggleModuleCompletion.mutate({
                                    enrollmentId: activeEnrollment.id,
                                    moduleNumber: moduleNum,
                                  });
                                }
                              }}
                            />
                            <label
                              htmlFor={`module-${moduleNum}-complete`}
                              className={`text-sm font-medium cursor-pointer ${!hasSubmittedAssessment ? 'text-muted-foreground' : ''}`}
                            >
                              Mark as complete
                            </label>
                          </div>
                          {!hasSubmittedAssessment && (
                            <p className="text-xs text-muted-foreground italic">
                              Upload assessment below to unlock completion
                            </p>
                          )}
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
