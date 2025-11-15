import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { BookOpen, Users, Award, Globe, Heart, Lightbulb } from "lucide-react";

export default function Home() {
  const courses = [
    {
      title: "Edo Beginner",
      description: "Perfect for absolute beginners. Learn the Edo alphabet, basic greetings, numbers, and everyday vocabulary.",
      icon: BookOpen,
      href: "/courses/beginner",
    },
    {
      title: "Edo Intermediary",
      description: "Build on your basics. Form sentences, ask questions, and explore Edo culture and proverbs.",
      icon: Users,
      href: "/courses/intermediary",
    },
    {
      title: "Edo Proficient",
      description: "Achieve fluency. Master advanced grammar, cultural expressions, and confident communication.",
      icon: Award,
      href: "/courses/proficient",
    },
  ];

  const benefits = [
    {
      icon: Users,
      title: "Enhance Communication",
      description: "Strengthen connections with family, community, and elders who primarily use the language.",
    },
    {
      icon: Globe,
      title: "Preserve Culture",
      description: "Play a vital role in keeping Edo heritage and traditions alive for future generations.",
    },
    {
      icon: Heart,
      title: "Build Connections",
      description: "Foster camaraderie and strengthen community bonds through shared language.",
    },
    {
      icon: Lightbulb,
      title: "Discover Wisdom",
      description: "Unlock access to literature, folklore, and traditional knowledge beyond translation.",
    },
    {
      icon: Award,
      title: "Embrace Heritage",
      description: "Strengthen your sense of belonging and connection to your roots.",
    },
    {
      icon: BookOpen,
      title: "Expand Opportunities",
      description: "Unlock opportunities in education, research, cultural preservation, and local governance.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-muted to-background py-20 md:py-32">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="text-4xl md:text-5xl font-display text-primary">Ób'ókhían</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
              Learn to Speak, Read,
              <br />
              or Write in Edo
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              It's never too late to learn—let us help you bridge the gap! Reconnect with your heritage through live online classes, expert instructors, and a supportive community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Enroll Now
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Edo Language Academy – Where Learning Meets Fun!
            </h2>
            <p className="text-lg text-muted-foreground">
              Join us on an exciting journey to learn and grow together. At Edo Language Academy, we make learning the Edo language enjoyable and accessible for everyone.
            </p>
          </div>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-muted-foreground mb-4">
              Explore Edo alphabets, numbers, vocabulary, and everyday phrases in a simple and engaging way. Our goal is to help learners of all ages and backgrounds grasp the language effortlessly through easy-to-understand conversations.
            </p>
            <p className="text-muted-foreground">
              No matter your skill level, we're here to support your learning experience. Let's make learning Edo fun and rewarding!
            </p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our structured 8-week programmes are designed for kids, teens, and adults at every level.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => {
              const Icon = course.icon;
              return (
                <Card key={course.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-display">{course.title}</CardTitle>
                    <CardDescription className="text-base">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={course.href}>
                      <Button variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How Edo Language Academy Works
            </h2>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Level</h3>
              <p className="text-muted-foreground">
                Select from Beginner, Intermediary, or Proficient based on your current skill level.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Join a Cohort</h3>
              <p className="text-muted-foreground">
                Enroll in our next 8-week cohort and join live Zoom classes every Saturday.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Learning</h3>
              <p className="text-muted-foreground">
                Attend live classes, access recordings, and earn your certificate upon completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Learn Edo */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Why Learn Edo?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-secondary" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join our next cohort and begin learning Edo with expert instructors and a supportive community.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Enroll Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
