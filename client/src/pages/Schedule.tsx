import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Calendar, Clock, Users, Globe } from "lucide-react";

export default function Schedule() {
  const upcomingCohorts = [
    {
      level: "Beginner",
      startDate: "January 11, 2025",
      endDate: "March 1, 2025",
      ageGroups: ["Kids (5-12)", "Teens (13-17)", "Adults (18+)"],
      spotsLeft: 15,
    },
    {
      level: "Intermediary",
      startDate: "January 18, 2025",
      endDate: "March 8, 2025",
      ageGroups: ["Kids (5-12)", "Teens (13-17)", "Adults (18+)"],
      spotsLeft: 12,
    },
    {
      level: "Proficient",
      startDate: "January 25, 2025",
      endDate: "March 15, 2025",
      ageGroups: ["Teens (13-17)", "Adults (18+)"],
      spotsLeft: 8,
    },
  ];

  const classSchedule = [
    {
      ageGroup: "Kids (5-12)",
      time: "10:00 AM UK Time",
      cstTime: "4:00 AM CST",
      duration: "60 minutes",
    },
    {
      ageGroup: "Teens (13-17)",
      time: "12:00 PM UK Time",
      cstTime: "6:00 AM CST",
      duration: "75 minutes",
    },
    {
      ageGroup: "Adults (18+)",
      time: "2:00 PM UK Time",
      cstTime: "8:00 AM CST",
      duration: "75 minutes",
    },
  ];

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
              All classes are held live on Zoom every Saturday. Choose the time slot that works best for your age group and timezone.
            </p>
          </div>
        </div>
      </section>

      {/* Class Times */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-4">
              Weekly Class Times
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              All classes meet every Saturday at the following times
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {classSchedule.map((schedule, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{schedule.ageGroup}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-sm">{schedule.time}</div>
                        <div className="text-xs text-muted-foreground">
                          ({schedule.cstTime})
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {schedule.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        Every Saturday
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Cohorts */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-4">
              Upcoming Cohorts
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Enroll now to secure your spot in the next cohort
            </p>
            <div className="space-y-6">
              {upcomingCohorts.map((cohort, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl font-display">
                          Edo {cohort.level}
                        </CardTitle>
                        <CardDescription className="text-base mt-2">
                          {cohort.startDate} - {cohort.endDate}
                        </CardDescription>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="text-sm font-semibold text-primary">
                          {cohort.spotsLeft} spots left
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Limited availability
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold mb-2">
                          Available for:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {cohort.ageGroups.map((group, groupIndex) => (
                            <span
                              key={groupIndex}
                              className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                            >
                              {group}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Link href="/register">
                        <Button>Enroll Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programme Structure */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              8-Week Programme Structure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                    6
                  </div>
                  <CardTitle>Instruction Weeks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Six weeks of structured learning with new content each week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                    1
                  </div>
                  <CardTitle>Revision Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    One week dedicated to reviewing all course material
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                    1
                  </div>
                  <CardTitle>Assessment Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Final assessment and certificate award ceremony
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-8">
              Important Information
            </h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Class Format</h4>
                  <p className="text-sm text-muted-foreground">
                    All classes are conducted live via Zoom. You'll receive the meeting link upon enrollment.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recordings Available</h4>
                  <p className="text-sm text-muted-foreground">
                    Can't make a live session? All classes are recorded and available for 30 days after the course ends.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Attendance Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    While we encourage live attendance, you can complete the course using recordings if needed. However, live participation enhances learning.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Certificate Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    To receive your certificate, you must complete the final assessment in Week 8.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Join a Cohort?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Spots fill up quickly! Enroll today to secure your place in the next cohort.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="px-8">
                Enroll Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
