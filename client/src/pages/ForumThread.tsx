import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageCircle, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useRoute } from "wouter";

export default function ForumThread() {
  const { user, isAuthenticated } = useAuth();
  const [, params] = useRoute("/forum/:id");
  const threadId = params?.id ? parseInt(params.id) : 0;
  const [replyContent, setReplyContent] = useState("");

  const { data: threadData } = trpc.forum.getThread.useQuery(
    { threadId },
    { enabled: threadId > 0 && isAuthenticated }
  );

  const replyMutation = trpc.forum.replyToThread.useMutation({
    onSuccess: () => {
      toast.success("Reply posted!");
      setReplyContent("");
    },
  });

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    await replyMutation.mutateAsync({
      threadId,
      content: replyContent,
    });
  };

  if (!threadData) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Loading thread...</p>
        </div>
      </Layout>
    );
  }

  const { thread, replies } = threadData;

  return (
    <Layout>
      <section className="py-12 bg-background">
        <div className="container max-w-4xl">
          <Link href="/forum">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Forum
            </Button>
          </Link>

          {/* Thread */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-display font-bold mb-2">{thread.thread.title}</h1>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>by {thread.user?.name || "Anonymous"}</span>
                    <span>•</span>
                    <span>{new Date(thread.thread.createdAt).toLocaleDateString()}</span>
                    {thread.thread.courseLevel && (
                      <>
                        <span>•</span>
                        <Badge variant="outline">
                          {thread.thread.courseLevel.charAt(0).toUpperCase() +
                            thread.thread.courseLevel.slice(1)}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{thread.thread.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Replies */}
          <div className="space-y-4 mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
            </h2>

            {replies.map(({ reply, user: replyUser }) => (
              <Card key={reply.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{replyUser?.name || "Anonymous"}</span>
                        {reply.isInstructorReply === 1 && (
                          <Badge variant="default" className="gap-1">
                            <Shield className="w-3 h-3" />
                            Instructor
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          • {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reply Form */}
          {thread.thread.isLocked === 0 && (
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleReply} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Reply</label>
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={replyMutation.isPending}>
                    Post Reply
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {thread.thread.isLocked === 1 && (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">This thread is locked and cannot accept new replies.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </Layout>
  );
}
