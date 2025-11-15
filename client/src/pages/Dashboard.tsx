import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Download, 
  FileText, 
  GraduationCap, 
  PlayCircle, 
  TrendingUp,
  Users
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [selectedEnrollment, setSelectedEnrollment] = useState<number | null>(null);

  const { data: enrollments, isLoading: enrollmentsLoading } = trpc.student.getMyEnrollments.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: progressData } = trpc.student.getMyProgress.useQuery(
    { enrollmentId: selectedEnrollment! },
    { enabled: !!selectedEnrollment }
  );

  const { data: materials } = trpc.student.getCourseMaterials.useQuery(
    { enrollmentId: selectedEnrollment! },
    { enabled: !!selectedEnrollment }
  );

  const markWeekCompletedMutation = trpc.student.markWeekCompleted.useMutation({
    onSuccess: () => {
      toast.success("Week marked as completed!");
    },
  });

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    return (
      <Layout>
        <div className="container py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Login Required</CardTitle>
              <CardDescription>
                Please log in to access your student dashboard
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

  // Auto-select first enrollment if available
  if (enrollments && enrollments.length > 0 && !selectedEnrollment) {
    setSelectedEnrollment(enrollments[0].id);
  }

  const enrollment = progressData?.enrollment;
  const progress = progressData?.progress;
  const completedWeeks = progress?.completedWeeks 
    ? progress.completedWeeks.split(",").map(Number).filter(Boolean)
    : [];
  const progressPercentage = (completedWeeks.length / 8) * 100;

  const handleMarkWeekCompleted = async (week: number) => {
    if (!selectedEnrollment) return;
    await markWeekCompletedMutation.mutateAsync({
      enrollmentId: selectedEnrollment,
      week,
    });
  };

  return (
    <Layout>
      {/* Dashboard Header */}
      <section className="bg-gradient-to-b from-muted to-background py-12">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                My Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name || "Student"}! Track your learning progress.
              </p>
            </div>
            <GraduationCap className="w-16 h-16 text-primary opacity-20" />
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12 bg-background">
        <div className="container">
          {enrollmentsLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading your courses...</p>
            </div>
          ) : !enrollments || enrollments.length === 0 ? (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>No Enrollments Found</CardTitle>
                <CardDescription>
                  You haven't enrolled in any courses yet. Browse our courses and get started!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a href="/courses">Browse Courses</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8">
              {/* Course Selector */}
              {enrollments.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>My Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {enrollments.map((enr) => (
                        <Button
                          key={enr.id}
                          variant={selectedEnrollment === enr.id ? "default" : "outline"}
                          onClick={() => setSelectedEnrollment(enr.id)}
                        >
                          {enr.courseLevel.charAt(0).toUpperCase() + enr.courseLevel.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Progress Overview */}
              {enrollment && progress && (
                <div className="grid md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Current Week</CardDescription>
                      <CardTitle className="text-3xl">{progress.currentWeek}/8</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Week {progress.currentWeek}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Completion</CardDescription>
                      <CardTitle className="text-3xl">{Math.round(progressPercentage)}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress value={progressPercentage} className="h-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Attendance</CardDescription>
                      <CardTitle className="text-3xl">{progress.attendanceCount}/8</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>Classes attended</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Status</CardDescription>
                      <CardTitle className="text-xl">
                        <Badge variant={enrollment.status === "active" ? "default" : "secondary"}>
                          {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {progress.certificateIssued ? (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <GraduationCap className="w-4 h-4" />
                          <span>Certificate earned!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="w-4 h-4" />
                          <span>In progress</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Main Dashboard Tabs */}
              <Tabs defaultValue="progress" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="progress">Progress</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="certificate">Certificate</TabsTrigger>
                </TabsList>

                {/* Progress Tab */}
                <TabsContent value="progress" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Progress</CardTitle>
                      <CardDescription>
                        Track your progress through the 8-week course
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((week) => {
                          const isCompleted = completedWeeks.includes(week);
                          const isCurrent = week === progress?.currentWeek;

                          return (
                            <Card key={week} className={isCurrent ? "border-primary" : ""}>
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg">Week {week}</CardTitle>
                                  {isCompleted && (
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent>
                                {!isCompleted && week <= (progress?.currentWeek || 1) && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleMarkWeekCompleted(week)}
                                    disabled={markWeekCompletedMutation.isPending}
                                  >
                                    Mark as Complete
                                  </Button>
                                )}
                                {isCompleted && (
                                  <Badge variant="secondary">Completed</Badge>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Materials Tab */}
                <TabsContent value="materials" className="space-y-4">
                  {materials && Object.keys(materials).length > 0 ? (
                    Object.entries(materials).map(([week, weekMaterials]) => (
                      <Card key={week}>
                        <CardHeader>
                          <CardTitle>Week {week} Materials</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {weekMaterials.map((material) => (
                              <div
                                key={material.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  {material.type === "video" && <PlayCircle className="w-5 h-5 text-primary" />}
                                  {material.type === "pdf" && <FileText className="w-5 h-5 text-primary" />}
                                  {material.type === "worksheet" && <BookOpen className="w-5 h-5 text-primary" />}
                                  {material.type === "recording" && <PlayCircle className="w-5 h-5 text-primary" />}
                                  <div>
                                    <p className="font-medium">{material.title}</p>
                                    {material.description && (
                                      <p className="text-sm text-muted-foreground">
                                        {material.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {material.fileUrl && (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                                      <Download className="w-4 h-4 mr-2" />
                                      Download
                                    </a>
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Course materials will be available once the course starts.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Certificate Tab */}
                <TabsContent value="certificate">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Certificate</CardTitle>
                      <CardDescription>
                        Your certificate of completion
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-12">
                      {progress?.certificateIssued ? (
                        <div className="text-center space-y-6">
                          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <GraduationCap className="w-12 h-12 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-display font-bold mb-2">
                              Congratulations!
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              You've successfully completed the course with a score of{" "}
                              {progress.assessmentScore}%
                            </p>
                            {progress.certificateUrl && (
                              <Button size="lg" asChild>
                                <a href={progress.certificateUrl} download>
                                  <Download className="w-5 h-5 mr-2" />
                                  Download Certificate
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-4">
                          <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
                          <div>
                            <h3 className="text-xl font-semibold mb-2">
                              Certificate Not Yet Available
                            </h3>
                            <p className="text-muted-foreground">
                              Complete all 8 weeks and pass the final assessment to earn your certificate.
                            </p>
                          </div>
                          <div className="max-w-md mx-auto">
                            <Progress value={progressPercentage} className="h-3" />
                            <p className="text-sm text-muted-foreground mt-2">
                              {completedWeeks.length} of 8 weeks completed
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
