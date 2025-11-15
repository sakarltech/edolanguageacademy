import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Users, Clock, Calendar, Award, CheckCircle2, Video } from "lucide-react";

export default function CourseIntermediary() {
  const modules = [
    {
      week: "Weeks 1-2",
      title: "Advanced Alphabets and Pronunciations",
      topics: [
        "Complex sound combinations",
        "Mastering tonal variations",
        "Reading fluency exercises",
        "Pronunciation correction techniques",
      ],
    },
    {
      week: "Weeks 3-4",
      title: "Numbers in Edo (21-50)",
      topics: [
        "Counting from 21 to 50",
        "Using larger numbers in context",
        "Money, dates, and measurements",
        "Mathematical expressions in Edo",
      ],
    },
    {
      week: "Week 5",
      title: "Sentence Formulation (Reading and Writing)",
      topics: [
        "Basic sentence structure",
        "Subject-verb-object patterns",
        "Asking and answering questions",
        "Writing simple paragraphs",
      ],
    },
    {
      week: "Week 6",
      title: "Introduction to Edo History and Proverbs",
      topics: [
        "Brief history of the Edo people",
        "Common Edo proverbs and their meanings",
        "Cultural significance of language",
        "Traditional stories and folklore",
      ],
    },
    {
      week: "Week 7",
      title: "Revision Week",
      topics: [
        "Comprehensive review of all modules",
        "Practice conversations and writing",
        "Cultural knowledge quiz preparation",
        "Final assessment overview",
      ],
    },
    {
      week: "Week 8",
      title: "Final Assessment",
      topics: [
        "Written test on grammar and vocabulary",
        "Oral conversation assessment",
        "Cultural knowledge evaluation",
        "Certificate presentation",
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
    "Master advanced pronunciation and tonal patterns",
    "Count confidently from 1 to 50",
    "Form complete sentences in Edo",
    "Ask and answer questions effectively",
    "Understand and use common proverbs",
    "Appreciate Edo cultural context and history",
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted to-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                Level 2
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Edo Intermediary
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Build on your basics and develop conversational skills. Learn advanced pronunciations, sentence formation, and explore Edo culture, history, and proverbs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Enroll Now - £24.99
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
              Join our next cohort for just £24.99 and continue your path toward fluency.
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
