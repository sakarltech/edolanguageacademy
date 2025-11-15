import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Ób'ókhían! 👋 I'm Efosa, your Edo Language Academy assistant. How can I help you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = trpc.chatbot.sendMessage.useMutation();
  const submitEmailMutation = trpc.chatbot.submitEmail.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const result = await sendMessageMutation.mutateAsync({
        message: userMessage,
        conversationHistory: messages,
        userEmail: email || undefined,
      });

      if (result.success) {
        // Add assistant response
        const messageContent = typeof result.message === 'string' ? result.message : 'I received your message.';
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: messageContent },
        ]);

        // If needs email and user hasn't provided it yet
        if (result.needsEmail && !email) {
          setShowEmailForm(true);
          setLastQuestion(userMessage);
        }
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Chatbot error:", error);
    }
  };

  const handleSubmitEmail = async () => {
    if (!email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const result = await submitEmailMutation.mutateAsync({
        email: email.trim(),
        lastQuestion,
      });

      if (result.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: result.message,
          },
        ]);
        setShowEmailForm(false);
        toast.success("Email submitted successfully!");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to submit email. Please try again.");
      console.error("Email submission error:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (showEmailForm) {
        handleSubmitEmail();
      } else {
        handleSendMessage();
      }
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <CardTitle className="text-lg">Efosa - Your Edo Assistant</CardTitle>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary-foreground/20 rounded p-1 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm opacity-90 mt-1">
              Ask me anything about our courses!
            </p>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {sendMessageMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground rounded-lg px-4 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Email Form */}
            {showEmailForm && (
              <div className="border-t border-border p-4 bg-muted/50">
                <Label htmlFor="chatbot-email" className="text-sm mb-2 block">
                  Please provide your email so we can follow up:
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="chatbot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="your.email@example.com"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSubmitEmail}
                    disabled={submitEmailMutation.isPending}
                    size="sm"
                  >
                    {submitEmailMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border p-4 flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={sendMessageMutation.isPending || showEmailForm}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={sendMessageMutation.isPending || showEmailForm || !inputMessage.trim()}
                  size="icon"
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
