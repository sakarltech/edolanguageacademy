import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, Plus, Edit, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function PrivateClassAdmin() {
  const [selectedEnrollment, setSelectedEnrollment] = useState<number | null>(null);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);
  const [schedulingDialogOpen, setSchedulingDialogOpen] = useState(false);

  // Session form state
  const [sessionNumber, setSessionNumber] = useState(1);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [sessionStatus, setSessionStatus] = useState<"scheduled" | "completed" | "cancelled" | "rescheduled">("scheduled");
  const [duration, setDuration] = useState(60);
  const [instructorNotes, setInstructorNotes] = useState("");
  const [materialsUrl, setMaterialsUrl] = useState("");
  const [recordingUrl, setRecordingUrl] = useState("");

  // Scheduling form state
  const [schedulingStatus, setSchedulingStatus] = useState<"pending" | "coordinating" | "scheduled" | "completed">("coordinating");
  const [coordinationNotes, setCoordinationNotes] = useState("");

  const { data: enrollments, refetch: refetchEnrollments } = trpc.privateClass.getAllPrivateEnrollments.useQuery();
  const { data: schedulingInfo, refetch: refetchScheduling } = trpc.privateClass.getSchedulingInfoAdmin.useQuery(
    { enrollmentId: selectedEnrollment! },
    { enabled: !!selectedEnrollment }
  );
  const { data: sessions, refetch: refetchSessions } = trpc.privateClass.getSessionsAdmin.useQuery(
    { enrollmentId: selectedEnrollment! },
    { enabled: !!selectedEnrollment }
  );

  const updateScheduling = trpc.privateClass.updateSchedulingStatus.useMutation({
    onSuccess: () => {
      toast.success("Scheduling status updated");
      refetchScheduling();
      setSchedulingDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update scheduling");
    },
  });

  const createOrUpdateSession = trpc.privateClass.createOrUpdateSession.useMutation({
    onSuccess: () => {
      toast.success(editingSession ? "Session updated" : "Session created");
      refetchSessions();
      setSessionDialogOpen(false);
      resetSessionForm();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save session");
    },
  });

  const deleteSession = trpc.privateClass.deleteSession.useMutation({
    onSuccess: () => {
      toast.success("Session deleted");
      refetchSessions();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete session");
    },
  });

  const resetSessionForm = () => {
    setEditingSession(null);
    setSessionNumber(1);
    setScheduledDate("");
    setScheduledTime("");
    setSessionStatus("scheduled");
    setDuration(60);
    setInstructorNotes("");
    setMaterialsUrl("");
    setRecordingUrl("");
  };

  const handleOpenSessionDialog = (session?: any) => {
    if (session) {
      setEditingSession(session);
      setSessionNumber(session.sessionNumber);
      setScheduledDate(session.scheduledDate ? format(new Date(session.scheduledDate), "yyyy-MM-dd") : "");
      setScheduledTime(session.scheduledDate ? format(new Date(session.scheduledDate), "HH:mm") : "");
      setSessionStatus(session.status);
      setDuration(session.duration);
      setInstructorNotes(session.instructorNotes || "");
      setMaterialsUrl(session.materialsUrl || "");
      setRecordingUrl(session.recordingUrl || "");
    } else {
      resetSessionForm();
    }
    setSessionDialogOpen(true);
  };

  const handleSaveSession = () => {
    if (!selectedEnrollment) return;

    const scheduledDateTime = scheduledDate && scheduledTime 
      ? new Date(`${scheduledDate}T${scheduledTime}`)
      : undefined;

    createOrUpdateSession.mutate({
      id: editingSession?.id,
      enrollmentId: selectedEnrollment,
      sessionNumber,
      scheduledDate: scheduledDateTime,
      status: sessionStatus,
      duration,
      instructorNotes: instructorNotes.trim() || undefined,
      materialsUrl: materialsUrl.trim() || undefined,
      recordingUrl: recordingUrl.trim() || undefined,
    });
  };

  const handleUpdateScheduling = () => {
    if (!selectedEnrollment) return;

    updateScheduling.mutate({
      enrollmentId: selectedEnrollment,
      schedulingStatus,
      coordinationNotes: coordinationNotes.trim() || undefined,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const, icon: AlertCircle },
      coordinating: { label: "Coordinating", variant: "default" as const, icon: Clock },
      scheduled: { label: "Scheduled", variant: "default" as const, icon: Calendar },
      completed: { label: "Completed", variant: "outline" as const, icon: CheckCircle2 },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const selectedEnrollmentData = enrollments?.find(e => e.id === selectedEnrollment);

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-display font-bold">Private Class Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage private class enrollments, scheduling, and sessions
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Enrollments List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Private Enrollments</CardTitle>
                <CardDescription>{enrollments?.length || 0} total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {enrollments?.map((enrollment) => (
                    <button
                      key={enrollment.id}
                      onClick={() => setSelectedEnrollment(enrollment.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedEnrollment === enrollment.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <p className="font-medium">{enrollment.learnerName}</p>
                      <p className="text-sm text-muted-foreground">{enrollment.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Enrolled {format(new Date(enrollment.createdAt), "MMM d, yyyy")}
                      </p>
                    </button>
                  ))}
                  {!enrollments?.length && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No private class enrollments yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Right: Selected Enrollment Details */}
            <div className="lg:col-span-2 space-y-6">
              {!selectedEnrollment ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Select an enrollment to view details</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Scheduling Info */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>Scheduling Information</CardTitle>
                          <CardDescription>{selectedEnrollmentData?.learnerName}</CardDescription>
                        </div>
                        {schedulingInfo && getStatusBadge(schedulingInfo.schedulingStatus)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {schedulingInfo ? (
                        <>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium mb-1">Student Goals:</p>
                              <p className="text-sm text-muted-foreground">
                                {schedulingInfo.studentGoals || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Preferred Schedule:</p>
                              <p className="text-sm text-muted-foreground">
                                {schedulingInfo.preferredSchedule || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Timezone:</p>
                              <p className="text-sm text-muted-foreground">
                                {schedulingInfo.timezone || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Frequency:</p>
                              <p className="text-sm text-muted-foreground">
                                {schedulingInfo.frequency === "1x_per_week" ? "1x per week" :
                                 schedulingInfo.frequency === "2x_per_week" ? "2x per week" : "Custom"}
                              </p>
                            </div>
                          </div>
                          {schedulingInfo.coordinationNotes && (
                            <div className="bg-muted p-3 rounded-lg">
                              <p className="text-sm font-medium mb-1">Coordination Notes:</p>
                              <p className="text-sm">{schedulingInfo.coordinationNotes}</p>
                            </div>
                          )}
                          <Button size="sm" onClick={() => {
                            setSchedulingStatus(schedulingInfo.schedulingStatus);
                            setCoordinationNotes(schedulingInfo.coordinationNotes || "");
                            setSchedulingDialogOpen(true);
                          }}>
                            Update Status
                          </Button>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Student hasn't submitted scheduling preferences yet
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Sessions */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>Sessions</CardTitle>
                          <CardDescription>
                            {sessions?.filter(s => s.status === "completed").length || 0} of 8 completed
                          </CardDescription>
                        </div>
                        <Button size="sm" onClick={() => handleOpenSessionDialog()}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Session
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {sessions?.map((session) => (
                          <div key={session.id} className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                              {session.sessionNumber}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Session {session.sessionNumber}</p>
                              {session.scheduledDate && (
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(session.scheduledDate), "MMM d, yyyy 'at' h:mm a")}
                                </p>
                              )}
                              {session.instructorNotes && (
                                <p className="text-sm text-muted-foreground mt-1">{session.instructorNotes}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={session.status === "completed" ? "default" : "secondary"}>
                                {session.status}
                              </Badge>
                              <Button size="sm" variant="ghost" onClick={() => handleOpenSessionDialog(session)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => {
                                  if (confirm("Delete this session?")) {
                                    deleteSession.mutate({ id: session.id });
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {!sessions?.length && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No sessions scheduled yet
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Session Dialog */}
      <Dialog open={sessionDialogOpen} onOpenChange={setSessionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSession ? "Edit Session" : "Add New Session"}</DialogTitle>
            <DialogDescription>
              Schedule and manage private class session details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionNumber">Session Number</Label>
                <Input
                  id="sessionNumber"
                  type="number"
                  min={1}
                  max={8}
                  value={sessionNumber}
                  onChange={(e) => setSessionNumber(parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={sessionStatus} onValueChange={(val) => setSessionStatus(val as typeof sessionStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min={15}
                max={180}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Instructor Notes</Label>
              <Textarea
                id="notes"
                placeholder="Session notes, topics covered, homework assigned..."
                value={instructorNotes}
                onChange={(e) => setInstructorNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="materials">Materials URL</Label>
              <Input
                id="materials"
                type="url"
                placeholder="https://..."
                value={materialsUrl}
                onChange={(e) => setMaterialsUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recording">Recording URL</Label>
              <Input
                id="recording"
                type="url"
                placeholder="https://..."
                value={recordingUrl}
                onChange={(e) => setRecordingUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSessionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSession} disabled={createOrUpdateSession.isPending}>
              {createOrUpdateSession.isPending ? "Saving..." : "Save Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Scheduling Status Dialog */}
      <Dialog open={schedulingDialogOpen} onOpenChange={setSchedulingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Scheduling Status</DialogTitle>
            <DialogDescription>
              Update the coordination status and add notes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="schedulingStatus">Status</Label>
              <Select value={schedulingStatus} onValueChange={(val) => setSchedulingStatus(val as typeof schedulingStatus)}>
                <SelectTrigger id="schedulingStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="coordinating">Coordinating</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="coordinationNotes">Coordination Notes</Label>
              <Textarea
                id="coordinationNotes"
                placeholder="Internal notes about scheduling coordination..."
                value={coordinationNotes}
                onChange={(e) => setCoordinationNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSchedulingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateScheduling} disabled={updateScheduling.isPending}>
              {updateScheduling.isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
