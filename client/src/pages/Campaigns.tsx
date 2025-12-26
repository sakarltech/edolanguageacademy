import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Send,
  Mail,
  Users,
  Sparkles,
  Eye,
  Trash2,
  Edit,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";

export default function Campaigns() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditorDialog, setShowEditorDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showSendConfirmDialog, setShowSendConfirmDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduleDateTime, setScheduleDateTime] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [sendConfirmCount, setSendConfirmCount] = useState(0);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    audienceType: "all" as "all" | "by_tag" | "by_source",
    audienceFilter: "",
  });

  const [editorData, setEditorData] = useState({
    subject: "",
    preheader: "",
    bodyHtml: "",
    bodyText: "",
    ctaText: "",
    ctaLink: "",
  });

  const [aiBrief, setAiBrief] = useState("");
  const [aiTone, setAiTone] = useState<"professional" | "friendly" | "casual" | "urgent">("friendly");
  const [generatedSubjects, setGeneratedSubjects] = useState<string[]>([]);

  const utils = trpc.useUtils();

  const { data: campaigns, isLoading: campaignsLoading } = trpc.marketing.getCampaigns.useQuery(
    { status: statusFilter as any },
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const { data: filters } = trpc.marketing.getContactFilters.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: audienceCount } = trpc.marketing.getAudienceCount.useQuery(
    {
      audienceType: selectedCampaign?.audienceType || "all",
      audienceFilter: selectedCampaign?.audienceFilter || undefined,
    },
    { enabled: !!selectedCampaign }
  );

  const createCampaignMutation = trpc.marketing.createCampaign.useMutation({
    onSuccess: (data) => {
      toast.success("Campaign created!");
      setShowCreateDialog(false);
      setNewCampaign({ name: "", audienceType: "all", audienceFilter: "" });
      utils.marketing.getCampaigns.invalidate();
      // Open editor for the new campaign
      utils.marketing.getCampaign.fetch({ id: data.campaignId }).then((campaign) => {
        setSelectedCampaign(campaign);
        
        // Check if there's a pending template to apply
        const pendingTemplate = (window as any).__pendingTemplate;
        if (pendingTemplate) {
          setEditorData({
            subject: pendingTemplate.subject,
            preheader: pendingTemplate.preheader,
            bodyHtml: pendingTemplate.bodyHtml,
            bodyText: pendingTemplate.bodyText,
            ctaText: pendingTemplate.ctaText,
            ctaLink: pendingTemplate.ctaLink,
          });
          // Clear pending template
          delete (window as any).__pendingTemplate;
        } else {
          setEditorData({
            subject: campaign.subject || "",
            preheader: campaign.preheader || "",
            bodyHtml: campaign.bodyHtml || "",
            bodyText: campaign.bodyText || "",
            ctaText: campaign.ctaText || "",
            ctaLink: campaign.ctaLink || "",
          });
        }
        
        setShowEditorDialog(true);
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateCampaignMutation = trpc.marketing.updateCampaign.useMutation({
    onSuccess: () => {
      toast.success("Campaign saved!");
      utils.marketing.getCampaigns.invalidate();
      if (selectedCampaign) {
        utils.marketing.getCampaign.invalidate({ id: selectedCampaign.id });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteCampaignMutation = trpc.marketing.deleteCampaign.useMutation({
    onSuccess: () => {
      toast.success("Campaign deleted!");
      utils.marketing.getCampaigns.invalidate();
    },
  });

  const generateEmailMutation = trpc.marketing.generateEmailContent.useMutation({
    onSuccess: (data) => {
      if (data.content) {
        setGeneratedSubjects(data.content.subjectLines || []);
        setEditorData({
          subject: data.content.subjectLines?.[0] || "",
          preheader: data.content.preheader || "",
          bodyHtml: data.content.bodyHtml || "",
          bodyText: data.content.bodyText || "",
          ctaText: data.content.ctaText || "",
          ctaLink: data.content.ctaLink || "",
        });
        toast.success("Email content generated!");
      }
      setAiGenerating(false);
    },
    onError: (error) => {
      toast.error(error.message);
      setAiGenerating(false);
    },
  });

  const sendTestEmailMutation = trpc.marketing.sendTestEmail.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Test email sent!");
      } else {
        toast.error("Failed to send test email");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const sendCampaignMutation = trpc.marketing.sendCampaign.useMutation({
    onSuccess: (data) => {
      if (data.requiresConfirmation) {
        setSendConfirmCount(data.recipientCount || 0);
        setShowSendConfirmDialog(true);
      } else if (data.success) {
        toast.success(`Campaign sent! ${data.sentCount} emails delivered, ${data.failedCount} failed.`);
        setShowEditorDialog(false);
        setSelectedCampaign(null);
        utils.marketing.getCampaigns.invalidate();
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleGenerateEmail = () => {
    if (!aiBrief.trim()) {
      toast.error("Please enter a brief for the AI");
      return;
    }
    setAiGenerating(true);
    generateEmailMutation.mutate({ brief: aiBrief, tone: aiTone });
  };

  const handleSaveAndClose = () => {
    if (!selectedCampaign) return;
    updateCampaignMutation.mutate({
      id: selectedCampaign.id,
      ...editorData,
    });
    setShowEditorDialog(false);
  };

  const handleSendTest = () => {
    if (!selectedCampaign || !testEmail) {
      toast.error("Please enter a test email address");
      return;
    }
    // Save first, then send test
    updateCampaignMutation.mutate(
      { id: selectedCampaign.id, ...editorData },
      {
        onSuccess: () => {
          sendTestEmailMutation.mutate({
            campaignId: selectedCampaign.id,
            testEmail,
          });
        },
      }
    );
  };

  const handleSendCampaign = (confirmLargeSend = false) => {
    if (!selectedCampaign) return;
    // Save first, then send
    updateCampaignMutation.mutate(
      { id: selectedCampaign.id, ...editorData },
      {
        onSuccess: () => {
          sendCampaignMutation.mutate({
            campaignId: selectedCampaign.id,
            confirmLargeSend,
          });
        },
      }
    );
  };

  const handleScheduleCampaign = () => {
    if (!selectedCampaign) return;
    // Save first, then show schedule dialog
    updateCampaignMutation.mutate(
      { id: selectedCampaign.id, ...editorData },
      {
        onSuccess: () => {
          setShowScheduleDialog(true);
        },
      }
    );
  };

  const confirmSchedule = () => {
    if (!selectedCampaign || !scheduleDateTime) return;
    
    updateCampaignMutation.mutate(
      {
        id: selectedCampaign.id,
        status: "scheduled" as any,
        scheduledAt: new Date(scheduleDateTime).toISOString(),
      } as any,
      {
        onSuccess: () => {
          toast.success(`Campaign scheduled for ${new Date(scheduleDateTime).toLocaleString()}`);
          setShowScheduleDialog(false);
          setShowEditorDialog(false);
          utils.marketing.getCampaigns.invalidate();
        },
      }
    );
  };

  const openEditor = (campaign: any) => {
    setSelectedCampaign(campaign);
    setEditorData({
      subject: campaign.subject || "",
      preheader: campaign.preheader || "",
      bodyHtml: campaign.bodyHtml || "",
      bodyText: campaign.bodyText || "",
      ctaText: campaign.ctaText || "",
      ctaLink: campaign.ctaLink || "",
    });
    setShowEditorDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      draft: { variant: "secondary", icon: Edit },
      scheduled: { variant: "outline", icon: Clock },
      sending: { variant: "default", icon: Loader2 },
      completed: { variant: "default", icon: CheckCircle2 },
      cancelled: { variant: "destructive", icon: XCircle },
    };
    const config = variants[status] || variants.draft;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`h-3 w-3 ${status === "sending" ? "animate-spin" : ""}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
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
            <h1 className="text-3xl font-bold">Email Campaigns</h1>
            <p className="text-muted-foreground">
              Create and send marketing emails to your contacts
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/contacts">
                <Users className="h-4 w-4 mr-2" />
                Contacts
              </Link>
            </Button>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="sending">Sending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Campaigns List */}
        {campaignsLoading ? (
          <div className="text-center py-8">Loading campaigns...</div>
        ) : campaigns?.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first email campaign to start reaching your audience
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {campaigns?.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{campaign.name}</h3>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {campaign.subject || "No subject set"}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {campaign.audienceType === "all"
                            ? "All subscribers"
                            : campaign.audienceType === "by_tag"
                            ? `Tag: ${campaign.audienceFilter}`
                            : `Source: ${campaign.audienceFilter}`}
                        </span>
                        {campaign.status === "completed" && (
                          <>
                            <span className="flex items-center gap-1">
                              <Send className="h-4 w-4" />
                              {campaign.sentCount} sent
                            </span>
                            {(campaign.openedCount ?? 0) > 0 && (
                              <span className="flex items-center gap-1 text-green-600">
                                <Eye className="h-4 w-4" />
                                {campaign.openedCount} opened ({(campaign.sentCount ?? 0) > 0 ? Math.round(((campaign.openedCount ?? 0) / (campaign.sentCount ?? 1)) * 100) : 0}%)
                              </span>
                            )}
                            {(campaign.clickedCount ?? 0) > 0 && (
                              <span className="flex items-center gap-1 text-blue-600">
                                <CheckCircle2 className="h-4 w-4" />
                                {campaign.clickedCount} clicked ({(campaign.sentCount ?? 0) > 0 ? Math.round(((campaign.clickedCount ?? 0) / (campaign.sentCount ?? 1)) * 100) : 0}%)
                              </span>
                            )}
                            {(campaign.failedCount ?? 0) > 0 && (
                              <span className="flex items-center gap-1 text-red-500">
                                <XCircle className="h-4 w-4" />
                                {campaign.failedCount} failed
                              </span>
                            )}
                          </>
                        )}
                        <span>
                          Created {new Date(campaign.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {campaign.status === "draft" && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => openEditor(campaign)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{campaign.name}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteCampaignMutation.mutate({ id: campaign.id })}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                      {campaign.status === "completed" && (
                        <Button variant="outline" size="sm" onClick={() => openEditor(campaign)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Campaign Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up your campaign details before creating the email content
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Start from Template (Optional)</Label>
                <Select
                  onValueChange={(templateId) => {
                    if (templateId === "blank") return;
                    // Import and apply template
                    import("../../../shared/emailTemplates").then(({ EMAIL_TEMPLATES }) => {
                      const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
                      if (template) {
                        setNewCampaign({ ...newCampaign, name: template.name });
                        toast.success("Template loaded! Complete campaign creation to edit.");
                        // Store template data to apply after campaign creation
                        (window as any).__pendingTemplate = template;
                      }
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Start from scratch or choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blank">✨ Blank Campaign</SelectItem>
                    <SelectItem value="boxing-day-2025">🎁 Boxing Day MEGA SALE - 40% OFF (Stack Both Codes)</SelectItem>
                    <SelectItem value="holiday-2026">🎄 Holiday Greetings & New Year Promotion 2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Campaign Name *</Label>
                <Input
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="e.g., December Newsletter"
                />
              </div>
              <div>
                <Label>Audience</Label>
                <Select
                  value={newCampaign.audienceType}
                  onValueChange={(v: any) => setNewCampaign({ ...newCampaign, audienceType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subscribed Contacts</SelectItem>
                    <SelectItem value="by_tag">Filter by Tag</SelectItem>
                    <SelectItem value="by_source">Filter by Source</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newCampaign.audienceType === "by_tag" && (
                <div>
                  <Label>Select Tag</Label>
                  <Select
                    value={newCampaign.audienceFilter}
                    onValueChange={(v) => setNewCampaign({ ...newCampaign, audienceFilter: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {filters?.tags?.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {newCampaign.audienceType === "by_source" && (
                <div>
                  <Label>Select Source</Label>
                  <Select
                    value={newCampaign.audienceFilter}
                    onValueChange={(v) => setNewCampaign({ ...newCampaign, audienceFilter: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a source" />
                    </SelectTrigger>
                    <SelectContent>
                      {filters?.sources?.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createCampaignMutation.mutate(newCampaign)}
                disabled={!newCampaign.name || createCampaignMutation.isPending}
              >
                {createCampaignMutation.isPending ? "Creating..." : "Create & Edit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Campaign Editor Dialog */}
        <Dialog open={showEditorDialog} onOpenChange={setShowEditorDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {selectedCampaign?.name}
                {selectedCampaign && getStatusBadge(selectedCampaign.status)}
              </DialogTitle>
              {audienceCount && (
                <DialogDescription>
                  Targeting {audienceCount.eligible} contacts ({audienceCount.suppressed} suppressed)
                </DialogDescription>
              )}
            </DialogHeader>

            <Tabs defaultValue="ai" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ai">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Generate
                </TabsTrigger>
                <TabsTrigger value="edit">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Content
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>

              {/* AI Generate Tab */}
              <TabsContent value="ai" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Generate Email with AI</CardTitle>
                    <CardDescription>
                      Describe what you want to communicate and AI will generate the email content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Your Brief</Label>
                      <Textarea
                        value={aiBrief}
                        onChange={(e) => setAiBrief(e.target.value)}
                        placeholder="e.g., Announce Saturday Zoom class time, prices, certificate after 8 weeks, include CTA to register."
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Tone</Label>
                      <Select value={aiTone} onValueChange={(v: any) => setAiTone(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleGenerateEmail}
                      disabled={aiGenerating || !aiBrief.trim()}
                      className="w-full"
                    >
                      {aiGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Email Content
                        </>
                      )}
                    </Button>

                    {generatedSubjects.length > 0 && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <Label className="mb-2 block">Subject Line Options (click to use)</Label>
                        <div className="space-y-2">
                          {generatedSubjects.map((subject, i) => (
                            <button
                              key={i}
                              onClick={() => setEditorData({ ...editorData, subject })}
                              className={`w-full text-left p-2 rounded border hover:bg-background transition-colors ${
                                editorData.subject === subject
                                  ? "border-primary bg-background"
                                  : "border-transparent"
                              }`}
                            >
                              {subject}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Edit Content Tab */}
              <TabsContent value="edit" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Subject Line *</Label>
                    <Input
                      value={editorData.subject}
                      onChange={(e) => setEditorData({ ...editorData, subject: e.target.value })}
                      placeholder="Your email subject"
                    />
                  </div>
                  <div>
                    <Label>Preheader</Label>
                    <Input
                      value={editorData.preheader}
                      onChange={(e) => setEditorData({ ...editorData, preheader: e.target.value })}
                      placeholder="Preview text shown in inbox"
                    />
                  </div>
                </div>
                <div>
                  <Label>Email Body (HTML)</Label>
                  <Textarea
                    value={editorData.bodyHtml}
                    onChange={(e) => setEditorData({ ...editorData, bodyHtml: e.target.value })}
                    placeholder="<p>Hello {{first_name}},</p>..."
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use {"{{first_name}}"} for personalization (defaults to "there" if not set)
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>CTA Button Text</Label>
                    <Input
                      value={editorData.ctaText}
                      onChange={(e) => setEditorData({ ...editorData, ctaText: e.target.value })}
                      placeholder="Register Now"
                    />
                  </div>
                  <div>
                    <Label>CTA Link</Label>
                    <Input
                      value={editorData.ctaLink}
                      onChange={(e) => setEditorData({ ...editorData, ctaLink: e.target.value })}
                      placeholder="https://www.edolanguageacademy.com"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Subject:</p>
                        <p className="font-semibold">{editorData.subject || "(No subject)"}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowPreviewDialog(true)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Full Preview
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="border rounded-lg p-4 bg-white max-h-[400px] overflow-y-auto"
                      dangerouslySetInnerHTML={{
                        __html: editorData.bodyHtml
                          .replace(/\{\{first_name\}\}/g, "John")
                          .replace(/\{\{email\}\}/g, "john@example.com"),
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t mt-4">
              <div className="flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="Test email address"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-[200px]"
                />
                <Button
                  variant="outline"
                  onClick={handleSendTest}
                  disabled={!testEmail || sendTestEmailMutation.isPending}
                >
                  {sendTestEmailMutation.isPending ? "Sending..." : "Send Test"}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSaveAndClose}>
                  Save & Close
                </Button>
                {selectedCampaign?.status === "draft" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleScheduleCampaign()}
                      disabled={!editorData.subject || !editorData.bodyHtml}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule for Later
                    </Button>
                    <Button
                      onClick={() => handleSendCampaign(false)}
                      disabled={!editorData.subject || !editorData.bodyHtml || sendCampaignMutation.isPending}
                    >
                      {sendCampaignMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Now
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Full Preview Dialog */}
        <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Email Preview</DialogTitle>
            </DialogHeader>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-4 border-b">
                <p className="text-sm">
                  <strong>From:</strong> Edo Language Academy
                </p>
                <p className="text-sm">
                  <strong>Subject:</strong> {editorData.subject}
                </p>
              </div>
              <div
                className="p-4 bg-white"
                dangerouslySetInnerHTML={{
                  __html: editorData.bodyHtml
                    .replace(/\{\{first_name\}\}/g, "John")
                    .replace(/\{\{email\}\}/g, "john@example.com"),
                }}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Schedule Dialog */}
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Campaign</DialogTitle>
              <DialogDescription>
                Choose when to send this campaign. It will be sent automatically at the scheduled time.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Schedule Date & Time *</Label>
                <Input
                  type="datetime-local"
                  value={scheduleDateTime}
                  onChange={(e) => setScheduleDateTime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Campaign will be sent at the specified time (your local timezone)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={confirmSchedule}
                disabled={!scheduleDateTime || updateCampaignMutation.isPending}
              >
                {updateCampaignMutation.isPending ? "Scheduling..." : "Schedule Campaign"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Large Send Confirmation Dialog */}
        <AlertDialog open={showSendConfirmDialog} onOpenChange={setShowSendConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Confirm Large Send
              </AlertDialogTitle>
              <AlertDialogDescription>
                You are about to send this campaign to <strong>{sendConfirmCount}</strong> recipients.
                This action cannot be undone. Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                setShowSendConfirmDialog(false);
                handleSendCampaign(true);
              }}>
                Yes, Send to {sendConfirmCount} Recipients
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
