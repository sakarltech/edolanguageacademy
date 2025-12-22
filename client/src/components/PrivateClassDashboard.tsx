import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, CheckCircle2, Circle, FileText, Video, MessageSquare, Award } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface PrivateClassDashboardProps {
  enrollmentId: number;
  learnerName: string;
}

export default function PrivateClassDashboard({ enrollmentId, learnerName }: PrivateClassDashboardProps) {
  const [schedulingDialogOpen, setSchedulingDialogOpen] = useState(false);
  const [studentGoals, setStudentGoals] = useState("");
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [timezone, setTimezone] = useState("");
  const [frequency, setFrequency] = useState<"1x_per_week" | "2x_per_week" | "custom">("1x_per_week");

  const { data: schedulingInfo, refetch: refetchScheduling } = trpc.privateClass.getSchedulingInfo.useQuery({ enrollmentId });
  const { data: sessions, refetch: refetchSessions } = trpc.privateClass.getMySessions.useQuery({ enrollmentId });

  const submitPreferences = trpc.privateClass.submitSchedulingPreferences.useMutation({
    onSuccess: () => {
      toast.success("Scheduling preferences submitted! We'll contact you shortly to finalize your schedule.");
      setSchedulingDialogOpen(false);
      refetchScheduling();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit preferences");
    },
  });

  const handleSubmitPreferences = () => {
    if (!studentGoals.trim() || !preferredSchedule.trim() || !timezone.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    submitPreferences.mutate({
      enrollmentId,
      studentGoals: studentGoals.trim(),
      preferredSchedule: preferredSchedule.trim(),
      timezone: timezone.trim(),
      frequency,
    });
  };

  const completedSessions = sessions?.filter(s => s.status === "completed").length || 0;
  const totalSessions = 8;
  const progressPercentage = (completedSessions / totalSessions) * 100;

  const upcomingSessions = sessions?.filter(s => 
    s.status === "scheduled" && s.scheduledDate && new Date(s.scheduledDate) > new Date()
  ).sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime()) || [];

  const pastSessions = sessions?.filter(s => 
    s.status === "completed" || (s.scheduledDate && new Date(s.scheduledDate) < new Date())
  ).sort((a, b) => new Date(b.scheduledDate || 0).getTime() - new Date(a.scheduledDate || 0).getTime()) || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending Coordination", variant: "secondary" as const },
      coordinating: { label: "Coordinating Schedule", variant: "default" as const },
      scheduled: { label: "Schedule Confirmed", variant: "default" as const },
      completed: { label: "All Sessions Complete", variant: "outline" as const },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            Òb'okhian, {learnerName.split(" ")[0] || "Learner"}!
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Private One-on-One Edo Language Instruction
          </p>
        </div>
      </div>

      {/* Scheduling Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Scheduling Status
              </CardTitle>
              <CardDescription>
                {schedulingInfo ? "Your scheduling preferences" : "Set up your personalized schedule"}
              </CardDescription>
            </div>
            {schedulingInfo && getStatusBadge(schedulingInfo.schedulingStatus)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!schedulingInfo || schedulingInfo.schedulingStatus === "pending" ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Welcome to your private Edo language class! To get started, please share your learning goals and preferred schedule. 
                We'll coordinate with you to set up your 8 personalized one-hour sessions.
              </p>
              <Button onClick={() => setSchedulingDialogOpen(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Set Up My Schedule
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">Your Learning Goals:</p>
                <p className="text-sm text-muted-foreground">{schedulingInfo.studentGoals}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Preferred Schedule:</p>
                <p className="text-sm text-muted-foreground">{schedulingInfo.preferredSchedule}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Timezone:</p>
                  <p className="text-sm text-muted-foreground">{schedulingInfo.timezone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Frequency:</p>
                  <p className="text-sm text-muted-foreground">
                    {schedulingInfo.frequency === "1x_per_week" ? "1x per week (8 weeks)" : 
                     schedulingInfo.frequency === "2x_per_week" ? "2x per week (4 weeks)" : "Custom"}
                  </p>
                </div>
              </div>
              {schedulingInfo.coordinationNotes && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm font-medium mb-1">Coordinator Notes:</p>
                  <p className="text-sm">{schedulingInfo.coordinationNotes}</p>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={() => setSchedulingDialogOpen(true)}>
                Update Preferences
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Your Progress
          </CardTitle>
          <CardDescription>
            {completedSessions} of {totalSessions} sessions completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            {completedSessions === totalSessions && (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-900 dark:text-green-100 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Congratulations! You've completed all sessions. Your certificate is being prepared.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>
              Your scheduled private classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    {session.sessionNumber}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Session {session.sessionNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.scheduledDate && format(new Date(session.scheduledDate), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                    </p>
                    <p className="text-sm text-muted-foreground">{session.duration} minutes</p>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Sessions */}
      {pastSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Past Sessions
            </CardTitle>
            <CardDescription>
              Review your completed classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastSessions.map((session) => (
                <div key={session.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center font-semibold">
                    {session.sessionNumber}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="font-medium">Session {session.sessionNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.scheduledDate && format(new Date(session.scheduledDate), "MMMM d, yyyy")}
                      </p>
                    </div>
                    {session.instructorNotes && (
                      <div className="bg-muted p-2 rounded text-sm">
                        <p className="font-medium mb-1">Instructor Notes:</p>
                        <p className="text-muted-foreground">{session.instructorNotes}</p>
                      </div>
                    )}
                    {(session.materialsUrl || session.recordingUrl) && (
                      <div className="flex gap-2">
                        {session.materialsUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={session.materialsUrl} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4 mr-1" />
                              Materials
                            </a>
                          </Button>
                        )}
                        {session.recordingUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={session.recordingUrl} target="_blank" rel="noopener noreferrer">
                              <Video className="h-4 w-4 mr-1" />
                              Recording
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <Badge variant={session.status === "completed" ? "default" : "secondary"}>
                    {session.status === "completed" ? "Completed" : session.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Have questions about your private class schedule or need to reschedule a session?
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:edolanguageacademy@gmail.com">
                Email Us
              </a>
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              const chatButton = document.querySelector('[aria-label="Chat with Efosa"]') as HTMLButtonElement;
              if (chatButton) chatButton.click();
            }}>
              Chat with Efosa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scheduling Preferences Dialog */}
      <Dialog open={schedulingDialogOpen} onOpenChange={setSchedulingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Set Up Your Private Class Schedule</DialogTitle>
            <DialogDescription>
              Tell us about your learning goals and preferred schedule. We'll coordinate with you to set up your personalized sessions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goals">What are your learning goals? *</Label>
              <Textarea
                id="goals"
                placeholder="e.g., I want to learn conversational Edo to speak with my family, focusing on everyday phrases and cultural expressions..."
                value={studentGoals}
                onChange={(e) => setStudentGoals(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule">What days and times work best for you? *</Label>
              <Textarea
                id="schedule"
                placeholder="e.g., Tuesdays and Thursdays between 6-8 PM, or weekends in the morning..."
                value={preferredSchedule}
                onChange={(e) => setPreferredSchedule(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Your Timezone *</Label>
                <Input
                  id="timezone"
                  placeholder="e.g., GMT, EST, PST"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Preferred Frequency *</Label>
                <Select value={frequency} onValueChange={(val) => setFrequency(val as typeof frequency)}>
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1x_per_week">1x per week (8 weeks)</SelectItem>
                    <SelectItem value="2x_per_week">2x per week (4 weeks)</SelectItem>
                    <SelectItem value="custom">Custom (discuss with coordinator)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSchedulingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitPreferences} disabled={submitPreferences.isPending}>
              {submitPreferences.isPending ? "Submitting..." : "Submit Preferences"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
