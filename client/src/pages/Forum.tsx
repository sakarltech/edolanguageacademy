import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Eye, MessageCircle, Pin, Lock, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Forum() {
  const { user, loading, isAuthenticated } = useAuth();
  const [newThreadOpen, setNewThreadOpen] = useState(false);
  const [newThread, setNewThread] = useState({
    title: "",
    content: "",
  });

  const { data: threads } = trpc.forum.getThreads.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createThreadMutation = trpc.forum.createThread.useMutation({
    onSuccess: () => {
      toast.success("Thread created successfully!");
      setNewThreadOpen(false);
      setNewThread({ title: "", content: "" });
    },
  });

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    await createThreadMutation.mutateAsync({
      title: newThread.title,
      content: newThread.content,
    });
  };

  if (!loading && !isAuthenticated) {
    return (
      <Layout>
        <div className="container py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Login Required</CardTitle>
              <CardDescription>
                Please log in to access the discussion forum
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

  return (
    <Layout>
      {/* Forum Header */}
      <section className="bg-gradient-to-b from-muted to-background py-12">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Discussion Forum
              </h1>
              <p className="text-muted-foreground">
                Ask questions, share experiences, and learn together
              </p>
            </div>
            <Dialog open={newThreadOpen} onOpenChange={setNewThreadOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Thread
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Thread</DialogTitle>
                  <DialogDescription>
                    Start a new discussion topic
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateThread} className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={newThread.title}
                      onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                      placeholder="What's your question or topic?"
                      required
                      minLength={5}
                    />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={newThread.content}
                      onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                      placeholder="Provide more details..."
                      rows={6}
                      required
                      minLength={10}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={createThreadMutation.isPending}>
                    Create Thread
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Threads List */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="space-y-4">
            {threads && threads.length > 0 ? (
              threads.map(({ thread, user: threadUser }) => (
                <Link key={thread.id} href={`/forum/${thread.id}`}>
                  <Card className="hover:border-primary transition-colors cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            {thread.isPinned === 1 && (
                              <Pin className="w-4 h-4 text-primary" />
                            )}
                            {thread.isLocked === 1 && (
                              <Lock className="w-4 h-4 text-muted-foreground" />
                            )}
                            <h3 className="font-semibold text-lg">{thread.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {thread.content}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>by {threadUser?.name || "Anonymous"}</span>
                            <span>•</span>
                            <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                            {thread.courseLevel && (
                              <>
                                <span>•</span>
                                <Badge variant="outline">
                                  {thread.courseLevel.charAt(0).toUpperCase() + thread.courseLevel.slice(1)}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{thread.viewCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{thread.replyCount}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No discussions yet. Be the first to start a conversation!
                  </p>
                  <Button onClick={() => setNewThreadOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Thread
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
