import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Calendar, Clock, Users, Globe, AlertCircle } from "lucide-react";
import { TIME_SLOTS, getUpcomingCohorts, formatCohortDate } from "@shared/scheduleUtils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Schedule() {
  useScrollAnimation();
  
  const upcomingCohorts = getUpcomingCohorts(3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted to-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Class Schedule
            </h1>
            <p className="text-lg text-muted-foreground">
              All classes are held live on Zoom every Saturday. Choose the time slot that works best for your timezone.
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Alert className="scroll-fade-in">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Two time options available:</strong> We offer classes at 11 AM GMT and 11 AM CST. 
                You only need to attend <strong>one</strong> of these time slots, not both. Choose whichever time suits your timezone best.
                All age groups (Kids, Teens, Adults) have the same class time and duration.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      {/* Class Times */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-4">
              Weekly Class Times
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              All classes meet every Saturday • 60 minutes duration • Same time for all age groups
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {TIME_SLOTS.map((slot, index) => (
                <Card key={slot.id} className="scroll-fade-in">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Globe className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">
                      {slot.time} {slot.timezone}
                    </CardTitle>
                    <CardDescription>
                      Suitable for: {slot.suitableFor.join(", ")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-3 text-muted-foreground">
                        Timezone Conversions:
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <strong>UK:</strong> {slot.conversions.uk}
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <strong>Nigeria:</strong> {slot.conversions.nigeria}
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <strong>Central Europe:</strong> {slot.conversions.centralEurope}
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <strong>North America:</strong> {slot.conversions.northAmerica}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Every Saturday</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <Clock className="w-4 h-4" />
                        <span>60 minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <Users className="w-4 h-4" />
                        <span>All age groups (Kids, Teens, Adults)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Cohorts */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-4">
              Upcoming Cohorts
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              New cohorts start every 10 weeks. Enroll now to secure your spot!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingCohorts.map((cohort, index) => (
                <Card key={index} className="scroll-slide-up">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>
                      {index === 0 ? "Next Cohort" : `Cohort ${index + 1}`}
                    </CardTitle>
                    <CardDescription>
                      {index === 0 && (
                        <span className="inline-flex items-center gap-1 text-accent font-semibold">
                          <AlertCircle className="w-3 h-3" />
                          Limited availability
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Start Date</div>
                      <div className="font-semibold">{formatCohortDate(cohort.startDate)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">End Date</div>
                      <div className="font-semibold">{formatCohortDate(cohort.endDate)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Duration</div>
                      <div className="font-semibold">8 weeks</div>
                    </div>
                    {index === 0 && (
                      <div className="pt-4 border-t">
                        <div className="text-sm text-accent font-semibold">
                          Only {cohort.spotsRemaining} spots left!
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Enroll Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Programme Structure */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              8-Week Programme Structure
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="scroll-fade-in">
                <CardHeader>
                  <CardTitle>Weeks 1-6: Core Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Four comprehensive modules covering all essential aspects of the Edo language,
                    from alphabets and pronunciation to conversation and cultural understanding.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="scroll-fade-in">
                <CardHeader>
                  <CardTitle>Week 7: Revision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Comprehensive review of all modules with practice sessions and assessment preparation.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="scroll-fade-in">
                <CardHeader>
                  <CardTitle>Week 8: Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Final written and oral assessments to demonstrate your learning, followed by certificate presentation.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="scroll-fade-in">
                <CardHeader>
                  <CardTitle>Flexible Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Access to class recordings, materials, and workbooks throughout the programme and beyond.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join our next cohort and begin your Edo language journey with expert instructors and a supportive community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Enroll Now
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  View Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
