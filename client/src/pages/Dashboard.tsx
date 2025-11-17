import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { BookOpen, Video, FileText, Download, CheckCircle2, Circle, Award } from "lucide-react";
import { toast } from "sonner";
import { ALL_CURRICULA } from "@shared/curriculum";

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const { data: enrollments, isLoading: enrollmentsLoading } = trpc.student.getMyEnrollments.useQuery(undefined, {
    enabled: isAuthenticated,
  });

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

  const handleEnrollCourse = (courseLevel: "beginner" | "intermediary" | "proficient" | "bundle") => {
    createCheckout.mutate({
      courseLevel,
      learnerName: user?.name || "",
      parentName: "",
      email: user?.email || "",
      phone: "",
      whatsappNumber: "",
      timeSlot: "11AM_GMT" as "11AM_GMT" | "11AM_CST",
    });
  };

  if (!activeEnrollment) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-display font-bold mb-4">Choose Your Learning Path</h1>
              <p className="text-lg text-muted-foreground">
                Select a course level to begin your Edo language journey
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  level: "beginner",
                  title: "Edo Beginner",
                  description: "Perfect for absolute beginners. Learn the Edo alphabet, basic greetings, and everyday phrases.",
                  price: "£29.99",
                },
                {
                  level: "intermediary",
                  title: "Edo Intermediary",
                  description: "Build on your basics. Form sentences, ask questions, and explore Edo culture and traditions.",
                  price: "£29.99",
                },
                {
                  level: "proficient",
                  title: "Edo Proficient",
                  description: "Achieve fluency. Master advanced grammar, cultural expressions, and confident communication.",
                  price: "£29.99",
                },
              ].map((course) => (
                <Card key={course.level} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="text-3xl font-bold text-primary mb-4">{course.price}</div>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                      <li>✓ 8-week structured programme</li>
                      <li>✓ Live classes (60 minutes)</li>
                      <li>✓ 4 comprehensive modules</li>
                      <li>✓ Certificate upon completion</li>
                    </ul>
                  </CardContent>
                  <CardContent className="pt-0">
                    <Button
                      className="w-full"
                      onClick={() => handleEnrollCourse(course.level as "beginner" | "intermediary" | "proficient")}
                      disabled={createCheckout.isPending}
                    >
                      {createCheckout.isPending ? "Processing..." : "Enroll Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8 bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Bundle Offer - Best Value!
                </CardTitle>
                <CardDescription>
                  Get all three levels and save £9.97
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-primary">£79.99</div>
                    <div className="text-sm text-muted-foreground line-through">£89.97</div>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => handleEnrollCourse("bundle")}
                    disabled={createCheckout.isPending}
                  >
                    {createCheckout.isPending ? "Processing..." : "Get Bundle"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

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
  }, {} as Record<number, typeof materials>);

  const handleToggleModule = async (moduleNumber: number) => {
    if (!activeEnrollment) return;
    await toggleModuleCompletion.mutateAsync({
      enrollmentId: activeEnrollment.id,
      moduleNumber,
    });
  };

  const getModuleIcon = (moduleNumber: number) => {
    return completedModules.includes(moduleNumber) ? (
      <CheckCircle2 className="h-5 w-5 text-green-600" />
    ) : (
      <Circle className="h-5 w-5 text-gray-400" />
    );
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "teaching_note":
        return <FileText className="h-4 w-4" />;
      case "pdf":
      case "worksheet":
        return <FileText className="h-4 w-4" />;
      case "recording":
        return <Video className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">My Learning Dashboard</h1>
          <p className="text-muted-foreground">
            {activeEnrollment.courseLevel.charAt(0).toUpperCase() + activeEnrollment.courseLevel.slice(1)} Level
          </p>
        </div>

        {/* Certificate Section */}
        {progress?.progress?.certificateIssued === 1 && progress?.progress?.certificateUrl && (
          <Card className="mb-8 border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                Certificate of Completion
              </CardTitle>
              <CardDescription>
                Congratulations! You have successfully completed the {activeEnrollment.courseLevel.charAt(0).toUpperCase() + activeEnrollment.courseLevel.slice(1)} course.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div>
                  <p className="font-medium mb-1">Your Certificate is Ready</p>
                  <p className="text-sm text-muted-foreground">
                    Download your official certificate of completion
                  </p>
                </div>
                <Button asChild>
                  <a
                    href={progress.progress.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Course Progress
            </CardTitle>
            <CardDescription>
              Complete all 4 modules to earn your certificate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">
                  {completedModules.length} of 4 modules completed
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>

            {/* Module Completion Checklist */}
            <div className="grid md:grid-cols-4 gap-4 pt-4">
              {[1, 2, 3, 4].map((moduleNum) => {
                const module = courseCurriculum.modules.find((m: any) => m.number === moduleNum);
                const isCompleted = completedModules.includes(moduleNum);
                return (
                  <div
                    key={moduleNum}
                    className={`p-4 border rounded-lg ${
                      isCompleted ? "bg-green-50 border-green-200" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => handleToggleModule(moduleNum)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-sm">Module {moduleNum}</p>
                        <p className="text-xs text-muted-foreground">{module?.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Weeks {module?.weeks.join(" & ")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Certificate Status */}
            {progress?.progress?.certificateIssued === 1 && (
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium">Certificate Earned!</span>
                  </div>
                  {progress?.progress?.certificateUrl && (
                    <Button asChild variant="outline" size="sm">
                      <a href={progress.progress.certificateUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download Certificate
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Module Content Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Course Materials</CardTitle>
            <CardDescription>
              Access teaching notes, videos, and resources for each module. Materials are view-only and cannot be downloaded.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="1" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {[1, 2, 3, 4].map((moduleNum) => {
                  const isCompleted = completedModules.includes(moduleNum);
                  return (
                    <TabsTrigger key={moduleNum} value={moduleNum.toString()} className="flex items-center gap-2">
                      {getModuleIcon(moduleNum)}
                      Module {moduleNum}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {[1, 2, 3, 4].map((moduleNum) => {
                const module = courseCurriculum.modules.find((m: any) => m.number === moduleNum);
                const moduleMaterials = materialsByModule?.[moduleNum] || [];

                return (
                  <TabsContent key={moduleNum} value={moduleNum.toString()} className="space-y-4 mt-6">
                    {/* Module Info */}
                    <div className="mb-6">
                      <h3 className="text-xl font-display font-bold mb-2">{module?.title}</h3>
                      <p className="text-muted-foreground mb-2">{module?.description}</p>
                      <Badge variant="outline">Weeks {module?.weeks.join(" & ")}</Badge>
                    </div>

                    {/* Learning Outcomes */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Learning Outcomes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {module?.learningOutcomes.map((outcome: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Materials */}
                    {moduleMaterials.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-semibold">Course Materials</h4>
                        {moduleMaterials.map((material: any) => (
                          <Card key={material.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-primary/10 rounded-lg">
                                    {getMaterialIcon(material.type)}
                                  </div>
                                  <div>
                                    <h5 className="font-medium">{material.title}</h5>
                                    {material.description && (
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {material.description}
                                      </p>
                                    )}
                                    <Badge variant="secondary" className="mt-2">
                                      {material.type.replace("_", " ").toUpperCase()}
                                    </Badge>
                                  </div>
                                </div>
                                {material.fileUrl && (
                                  <Button asChild size="sm" variant="outline">
                                    <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                                      View
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>No materials available yet for this module.</p>
                          <p className="text-sm mt-1">Check back soon!</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
