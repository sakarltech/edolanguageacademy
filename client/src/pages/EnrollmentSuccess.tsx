import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Mail, MessageCircle, Calendar } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

export default function EnrollmentSuccess() {
  const [location] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Extract session_id from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const id = params.get("session_id");
    setSessionId(id);
  }, [location]);

  const { data: enrollmentStatus } = trpc.enrollment.getEnrollmentStatus.useQuery(
    { sessionId: sessionId || "" },
    { enabled: !!sessionId }
  );

  return (
    <Layout>
      {/* Success Hero */}
      <section className="bg-gradient-to-b from-muted to-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Welcome to Edo Language Academy!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your enrollment has been confirmed. We're excited to have you join our community!
            </p>
            {enrollmentStatus && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Purchase Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-muted-foreground">Course Level</span>
                      <span className="font-semibold text-foreground capitalize">{enrollmentStatus.courseLevel?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-muted-foreground">Time Slot</span>
                      <span className="font-semibold text-foreground">{enrollmentStatus.timeSlot?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-muted-foreground">Payment Status</span>
                      <span className="font-semibold text-green-600 capitalize">{enrollmentStatus.status}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-muted-foreground">Confirmation Email</span>
                      <span className="font-semibold text-foreground">{enrollmentStatus.customerEmail}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-lg font-semibold">Amount Paid</span>
                      <span className="text-2xl font-bold text-primary">£{enrollmentStatus.amountTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6 h-auto">
                Go to Your Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              What Happens Next?
            </h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">Check Your Email</CardTitle>
                      <CardContent className="p-0">
                        <p className="text-muted-foreground">
                          You'll receive a confirmation email with your receipt and enrollment details within the next few minutes. Please check your spam folder if you don't see it.
                        </p>
                      </CardContent>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">Join Your WhatsApp Group</CardTitle>
                      <CardContent className="p-0">
                        {enrollmentStatus?.whatsappGroup ? (
                          <>
                            <p className="text-muted-foreground mb-4">
                              Click the button below to join your class WhatsApp group and connect with your instructor and classmates.
                            </p>
                            <a
                              href={enrollmentStatus.whatsappGroup.groupLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block"
                            >
                              <Button className="bg-green-600 hover:bg-green-700">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Join {enrollmentStatus.whatsappGroup.groupName}
                              </Button>
                            </a>
                          </>
                        ) : (
                          <p className="text-muted-foreground">
                            Your WhatsApp group link will be sent to your email within 24 hours. You'll connect with your instructor and classmates there.
                          </p>
                        )}
                      </CardContent>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">Receive Course Materials</CardTitle>
                      <CardContent className="p-0">
                        <p className="text-muted-foreground">
                          Before your first class, you'll receive the Zoom link, course materials, and your class schedule via email and WhatsApp.
                        </p>
                      </CardContent>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">Attend Your First Class</CardTitle>
                      <CardContent className="p-0">
                        <p className="text-muted-foreground">
                          Join us on Saturday for your first live Zoom class! Check the schedule page for your specific class time based on your age group.
                        </p>
                      </CardContent>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-center mb-8">
              Important Information
            </h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>All classes are held live on Zoom every Saturday</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Classes are recorded and available for 30 days after the course ends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Full refund available within the first week if not satisfied</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Certificate awarded upon successful completion of the course</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Camera must be ON during the final assessment in Week 8</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-display font-bold mb-6">
              Have Questions?
            </h2>
            <p className="text-muted-foreground mb-8">
              Our team is here to help! Feel free to reach out if you have any questions about your enrollment or the course.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </Link>
              <Link href="/faq">
                <Button size="lg" variant="outline">
                  View FAQs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
