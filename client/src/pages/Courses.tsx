import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { BookOpen, Users, Award, Clock, Calendar, CheckCircle2 } from "lucide-react";

export default function Courses() {
  const courses = [
    {
      level: "Beginner",
      icon: BookOpen,
      price: "£19.99",
      duration: "8 weeks",
      target: "New learners or those restarting from basics",
      modules: [
        "Alphabets and Sounds in Edo",
        "Numbers in Edo (1-20)",
        "Basic Greetings and Responses",
        "Basic Vocabularies in Edo",
      ],
      href: "/courses/beginner",
    },
    {
      level: "Intermediary",
      icon: Users,
      price: "£24.99",
      duration: "8 weeks",
      target: "Graduates of Beginner or learners with basic Edo",
      modules: [
        "Advanced Alphabets and Pronunciations",
        "Numbers in Edo (21–50)",
        "Sentence Formulation (Reading and Writing)",
        "Introduction to Edo History and Proverbs",
      ],
      href: "/courses/intermediary",
    },
    {
      level: "Proficient",
      icon: Award,
      price: "£29.99",
      duration: "8 weeks",
      target: "Graduates of Intermediary seeking structured fluency",
      modules: [
        "Advanced Numbers in Edo (51–100)",
        "Advanced Sentence Formulation",
        "Edo history, proverbs & cultural expressions",
        "Edo Language Fluency (Reading and Writing)",
      ],
      href: "/courses/proficient",
    },
  ];

  const features = [
    {
      icon: Clock,
      title: "60-75 Minute Classes",
      description: "Live Zoom sessions every Saturday with native instructors",
    },
    {
      icon: Calendar,
      title: "8-Week Programme",
      description: "6 weeks instruction + 1 week revision + 1 week assessment",
    },
    {
      icon: CheckCircle2,
      title: "Certificate of Completion",
      description: "Earn an official certificate upon passing the final assessment",
    },
  ];

  return (
    <Layout>
      <section className="bg-gradient-to-b from-muted to-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Our Courses
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our three-level Edo language programme designed for kids, teens, and adults at every skill level.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const Icon = course.icon;
              return (
                <Card key={course.level} className="flex flex-col">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-display">Edo {course.level}</CardTitle>
                    <CardDescription className="text-base">{course.target}</CardDescription>
                    <div className="flex items-baseline gap-2 mt-4">
                      <span className="text-3xl font-bold text-primary">{course.price}</span>
                      <span className="text-muted-foreground">/ {course.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">What You\'ll Learn:</h4>
                      <ul className="space-y-2">
                        {course.modules.map((module, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{module}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-auto">
                      <Link href={course.href}>
                        <Button className="w-full">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 opacity-90">
              Create an account to choose your level and join our next cohort.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="px-8">
                  Register to Enrol
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="px-8 bg-transparent border-white text-white hover:bg-white hover:text-primary">
                  Already have an account? Log in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
