import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Calendar, Clock, Users, Globe, AlertCircle, BookOpen, Award, GraduationCap } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAllClassTimes, formatClassTime, type CourseLevel } from "@/lib/timezoneConversions";

export default function Schedule() {
  useScrollAnimation();
  
  const allClassTimes = getAllClassTimes();

  const levelIcons: Record<CourseLevel, any> = {
    beginner: BookOpen,
    intermediary: Users,
    proficient: Award,
  };

  const levelColors: Record<CourseLevel, string> = {
    beginner: 'bg-green-500/10 text-green-600',
    intermediary: 'bg-blue-500/10 text-blue-600',
    proficient: 'bg-purple-500/10 text-purple-600',
  };

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
              Live online classes every Saturday on Zoom. Each level has its own dedicated time slot.
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
                <strong>Level-Based Schedule:</strong> Each course level has a specific class time. 
                You only attend the class for your enrolled level. All classes are 60 minutes and held every Saturday.
                Pre-recorded videos for each module will be available in your dashboard soon!
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      {/* Class Times by Level */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-4">
              Weekly Class Times by Level
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Every Saturday • 60 minutes per class • Times shown in your local timezone
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {allClassTimes.map(({ level, classTime, conversions }) => {
                const Icon = levelIcons[level];
                const colorClass = levelColors[level];
                
                return (
                  <Card key={level} className="scroll-fade-in">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl capitalize">
                            {level}
                          </CardTitle>
                          <CardDescription className="text-base font-semibold text-foreground mt-1">
                            {formatClassTime(classTime.gmtHour)}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Clock className="w-4 h-4" />
                          <span>60 minutes • Every Saturday</span>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-semibold mb-3 text-foreground">
                            Timezone Conversions:
                          </h4>
                          <div className="space-y-2">
                            {conversions.map((tz) => (
                              <div key={tz.timezone} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {tz.timezone} ({tz.abbreviation})
                                </span>
                                <span className="font-medium text-foreground">
                                  {tz.time}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Course Structure */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              Course Structure
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="scroll-fade-in">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>8-Week Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Each course runs for 8 weeks with one live class per week. Complete all modules at your own pace.
                  </p>
                </CardContent>
              </Card>

              <Card className="scroll-fade-in">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>4 Modules</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Structured learning with 4 comprehensive modules covering speaking, reading, writing, and cultural understanding.
                  </p>
                </CardContent>
              </Card>

              <Card className="scroll-fade-in">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Lifetime Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Access all course materials, recordings, and resources forever. Learn at your own pace even after completion.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center scroll-fade-in">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Choose your level and join the next available class. All courses include live instruction, 
              course materials, and lifetime access to recordings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Enroll Now
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
