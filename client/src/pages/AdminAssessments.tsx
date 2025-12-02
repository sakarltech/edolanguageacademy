import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { File, Eye, CheckCircle2, Clock, FileText } from "lucide-react";
import { toast } from "sonner";

export default function AdminAssessments() {
  const [statusFilter, setStatusFilter] = useState<"all" | "submitted" | "reviewed" | "graded">("all");
  const [courseLevelFilter, setCourseLevelFilter] = useState<"all" | "beginner" | "intermediary" | "proficient">("all");
  const [gradingDialogOpen, setGradingDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [gradingStatus, setGradingStatus] = useState<"reviewed" | "graded">("graded");

  const { data: submissions, isLoading, refetch } = trpc.admin.getAllAssessments.useQuery({
    status: statusFilter,
    courseLevel: courseLevelFilter,
  });

  const { data: stats } = trpc.admin.getAssessmentStats.useQuery();

  const gradeMutation = trpc.admin.gradeAssessment.useMutation({
    onSuccess: () => {
      toast.success("Assessment graded successfully! Student has been notified via email.");
      setGradingDialogOpen(false);
      setSelectedSubmission(null);
      setScore("");
      setFeedback("");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to grade assessment");
    },
  });

  const handleGrade = () => {
    if (!selectedSubmission) return;

    const scoreNum = parseInt(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      toast.error("Please enter a valid score between 0 and 100");
      return;
    }

    gradeMutation.mutate({
      submissionId: selectedSubmission.submission.id,
      score: scoreNum,
      feedback: feedback.trim() || undefined,
      status: gradingStatus,
    });
  };

  const openGradingDialog = (submission: any) => {
    setSelectedSubmission(submission);
    setScore(submission.submission.score?.toString() || "");
    setFeedback(submission.submission.feedback || "");
    setGradingStatus(submission.submission.status === "graded" ? "graded" : "graded");
    setGradingDialogOpen(true);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Assessment Review</h1>
        <p className="text-muted-foreground mt-2">
          Review and grade student assessment submissions
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.submitted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reviewed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.reviewed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Graded
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.graded}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="graded">Graded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course Level</Label>
              <Select value={courseLevelFilter} onValueChange={(value: any) => setCourseLevelFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediary">Intermediary</SelectItem>
                  <SelectItem value="proficient">Proficient</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>
            {submissions?.length || 0} submission(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Loading submissions...</p>
          ) : submissions && submissions.length > 0 ? (
            <div className="space-y-3">
              {submissions.map((item) => (
                <div
                  key={item.submission.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <File className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{item.submission.fileName}</p>
                        <Badge
                          variant={
                            item.submission.status === "graded"
                              ? "default"
                              : item.submission.status === "reviewed"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {item.submission.status === "submitted" && <Clock className="h-3 w-3 mr-1" />}
                          {item.submission.status === "reviewed" && <Eye className="h-3 w-3 mr-1" />}
                          {item.submission.status === "graded" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {item.submission.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        <span className="font-medium">{item.user?.name || item.enrollment?.learnerName}</span>
                        <span>•</span>
                        <span>
                          Module {item.submission.moduleNumber} - {item.submission.courseLevel}
                        </span>
                        <span>•</span>
                        <span>{formatDate(item.submission.createdAt)}</span>
                        <span>•</span>
                        <span>{formatFileSize(item.submission.fileSize)}</span>
                        {item.submission.score !== null && (
                          <>
                            <span>•</span>
                            <span className="font-medium text-foreground">
                              Score: {item.submission.score}/100
                            </span>
                          </>
                        )}
                      </div>
                      {item.submission.feedback && (
                        <p className="text-xs text-muted-foreground mt-1 italic line-clamp-2">
                          Feedback: {item.submission.feedback}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button asChild variant="outline" size="sm">
                      <a href={item.submission.fileUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => openGradingDialog(item)}
                    >
                      {item.submission.status === "graded" ? "Edit Grade" : "Grade"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No submissions found with the selected filters.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Grading Dialog */}
      <Dialog open={gradingDialogOpen} onOpenChange={setGradingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Grade Assessment</DialogTitle>
            <DialogDescription>
              Review and grade the student's submission. An email notification will be sent automatically.
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              {/* Submission Info */}
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedSubmission.submission.fileName}</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>Student:</strong> {selectedSubmission.user?.name || selectedSubmission.enrollment?.learnerName}
                  </p>
                  <p>
                    <strong>Module:</strong> {selectedSubmission.submission.moduleNumber} - {selectedSubmission.submission.courseLevel}
                  </p>
                  <p>
                    <strong>Submitted:</strong> {formatDate(selectedSubmission.submission.createdAt)}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <a
                    href={selectedSubmission.submission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Open Submission
                  </a>
                </Button>
              </div>

              {/* Grading Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="score">Score (0-100)</Label>
                  <Input
                    id="score"
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="Enter score"
                  />
                </div>

                <div>
                  <Label htmlFor="feedback">Feedback (Optional)</Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide constructive feedback to help the student improve..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={gradingStatus} onValueChange={(value: any) => setGradingStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reviewed">Reviewed (no score)</SelectItem>
                      <SelectItem value="graded">Graded (with score)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setGradingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGrade} disabled={gradeMutation.isPending}>
              {gradeMutation.isPending ? "Saving..." : "Save & Notify Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
