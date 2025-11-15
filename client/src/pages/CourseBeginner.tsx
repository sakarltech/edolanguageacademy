import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { BookOpen, Clock, Calendar, Award, CheckCircle2, Users, Video } from "lucide-react";

export default function CourseBeginner() {
  const modules = [
    {
      week: "Weeks 1-2",
      title: "Alphabets and Sounds in Edo",
      topics: [
        "Introduction to Edo alphabet system",
        "Pronunciation of vowels and consonants",
        "Tone marks and their importance",
        "Practice reading simple words",
      ],
    },
    {
      week: "Weeks 3-4",
      title: "Numbers in Edo (1-20)",
      topics: [
        "Counting from 1 to 20",
        "Using numbers in everyday contexts",
        "Age, time, and quantity expressions",
        "Practice exercises and games",
      ],
    },
    {
      week: "Week 5",
      title: "Basic Greetings and Responses",
      topics: [
        "Common greetings for different times of day",
        "Formal and informal greetings",
        "Appropriate responses and etiquette",
        "Cultural context of greetings",
      ],
    },
    {
      week: "Week 6",
      title: "Basic Vocabularies in Edo",
      topics: [
        "Family members and relationships",
        "Common objects and everyday items",
        "Basic verbs and actions",
        "Building simple phrases",
      ],
    },
    {
      week: "Week 7",
      title: "Revision Week",
      topics: [
        "Review all modules",
        "Practice conversations",
        "Q&A session with instructor",
        "Assessment preparation",
      ],
    },
    {
      week: "Week 8",
      title: "Final Assessment",
      topics: [
        "Written test on alphabets and vocabulary",
        "Oral assessment on greetings and numbers",
        "Certificate award ceremony",
        "Feedback and next steps",
      ],
    },
  ];

  const features = [
    {
      icon: Clock,
      title: "60-75 Minutes",
      description: "Weekly live sessions",
    },
    {
      icon: Calendar,
      title: "8 Weeks",
      description: "Complete programme",
    },
    {
      icon: Users,
      title: "Small Groups",
      description: "Age-specific cohorts",
    },
    {
      icon: Video,
      title: "Recordings",
      description: "Access to all sessions",
    },
    {
      icon: Award,
      title: "Certificate",
      description: "Upon completion",
    },
  ];

  const outcomes = [
    "Read and write the Edo alphabet confidently",
    "Count from 1 to 20 in Edo",
    "Greet people appropriately in various contexts",
    "Use basic vocabulary for everyday communication",
    "Understand fundamental Edo language structure",
    "Build a foundation for intermediate learning",
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted to-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                Level 1
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Edo Beginner
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Perfect for absolute beginners or those restarting from basics. Learn the Edo alphabet, basic greetings, numbers, and everyday vocabulary in a fun and engaging way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Enroll Now - £19.99
                </Button>
              </Link>
              <Link href="/schedule">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Schedule
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Course Modules */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4 text-center">
              Course Curriculum
            </h2>
            <p className="text-lg text-muted-foreground mb-12 text-center">
              8-week structured programme with 6 weeks of instruction, 1 week revision, and final assessment
            </p>
            <div className="space-y-4">
              {modules.map((module, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-primary font-semibold mb-2">
                          {module.week}
                        </div>
                        <CardTitle className="text-xl">{module.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {module.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Outcomes */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4 text-center">
              What You\'ll Achieve
            </h2>
            <p className="text-lg text-muted-foreground mb-12 text-center">
              By the end of this course, you will be able to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outcomes.map((outcome, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-foreground">{outcome}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Start Your Edo Language Journey?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join our next cohort for just £19.99 and continue your path toward fluency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="px-8">
                  Enroll Now
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  View All Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
