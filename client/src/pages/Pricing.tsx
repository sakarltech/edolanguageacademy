import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Check, Star, BookOpen, Users, Award } from "lucide-react";

export default function Pricing() {
  const courses = [
    {
      level: "Beginner",
      icon: BookOpen,
      price: "£19.99",
      description: "Perfect for absolute beginners",
      features: [
        "8-week structured programme",
        "60-75 minute weekly live classes",
        "Alphabets and basic sounds",
        "Numbers 1-20",
        "Basic greetings and vocabulary",
        "Access to class recordings",
        "Certificate of completion",
      ],
      href: "/courses/beginner",
      popular: false,
    },
    {
      level: "Intermediary",
      icon: Users,
      price: "£24.99",
      description: "Build on your foundation",
      features: [
        "8-week structured programme",
        "60-75 minute weekly live classes",
        "Advanced pronunciations",
        "Numbers 21-50",
        "Sentence formation",
        "Edo history and proverbs",
        "Access to class recordings",
        "Certificate of completion",
      ],
      href: "/courses/intermediary",
      popular: true,
    },
    {
      level: "Proficient",
      icon: Award,
      price: "£29.99",
      description: "Achieve fluency",
      features: [
        "8-week structured programme",
        "60-75 minute weekly live classes",
        "Numbers 51-100",
        "Advanced sentence structures",
        "Cultural expressions",
        "Reading and writing fluency",
        "Access to class recordings",
        "Certificate of proficiency",
      ],
      href: "/courses/proficient",
      popular: false,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted to-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the level that's right for you, or save with our complete bundle. All courses include live classes, recordings, and certification.
            </p>
          </div>
        </div>
      </section>

      {/* Individual Course Pricing */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Individual Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {courses.map((course) => {
              const Icon = course.icon;
              return (
                <Card
                  key={course.level}
                  className={`flex flex-col relative ${
                    course.popular ? "border-primary shadow-lg" : ""
                  }`}
                >
                  {course.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-display">
                      Edo {course.level}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {course.description}
                    </CardDescription>
                    <div className="mt-6">
                      <div className="text-4xl font-bold text-foreground">
                        {course.price}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        per 8-week course
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 mb-8 flex-1">
                      {course.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link href={course.href}>
                      <Button
                        className="w-full"
                        variant={course.popular ? "default" : "outline"}
                      >
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

      {/* Bundle Offer */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card className="border-primary/30 shadow-xl">
              <CardHeader className="text-center pb-8">
                <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <Star className="w-10 h-10 text-secondary" />
                </div>
                <CardTitle className="text-3xl font-display">
                  Complete Bundle - Best Value!
                </CardTitle>
                <CardDescription className="text-lg">
                  Get all three levels and save £9.97
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <span className="text-2xl text-muted-foreground line-through">
                      £74.97
                    </span>
                    <span className="text-5xl font-bold text-primary">£65</span>
                  </div>
                  <p className="text-muted-foreground">
                    Complete all three levels (24 weeks total)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-background rounded-lg">
                    <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">Beginner</div>
                    <div className="text-sm text-muted-foreground">8 weeks</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">Intermediary</div>
                    <div className="text-sm text-muted-foreground">8 weeks</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">Proficient</div>
                    <div className="text-sm text-muted-foreground">8 weeks</div>
                  </div>
                </div>

                <div className="bg-background p-6 rounded-lg mb-8">
                  <h4 className="font-semibold mb-4">Bundle includes:</h4>
                  <ul className="space-y-2">
                    {[
                      "All three course levels (Beginner, Intermediary, Proficient)",
                      "24 weeks of live instruction",
                      "72+ hours of live classes",
                      "Access to all class recordings",
                      "Three certificates of completion",
                      "Complete journey from basics to fluency",
                      "Priority support throughout your learning",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/register">
                  <Button size="lg" className="w-full text-lg">
                    Enroll in Complete Bundle - £65
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Age Groups */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Age-Specific Classes
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              All pricing applies to each age group. Choose the cohort that best fits your age.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kids</CardTitle>
                  <CardDescription className="text-lg">
                    Ages 5-12
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Fun, interactive lessons designed for young learners
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Teens</CardTitle>
                  <CardDescription className="text-lg">
                    Ages 13-17
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Engaging curriculum tailored for teenage learners
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Adults</CardTitle>
                  <CardDescription className="text-lg">
                    Ages 18+
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive learning for adult students
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              Pricing FAQs
            </h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    What payment methods do you accept?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We accept all major credit and debit cards through our secure payment processor.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Can I pay in installments?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Currently, we require full payment upfront for each course or bundle. However, you can enroll in courses individually if you prefer to spread the cost.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    What is your refund policy?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We offer a full refund within the first week of the course if you're not satisfied. After that, refunds are provided on a case-by-case basis.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Do you offer discounts for groups or families?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! Contact us at support@edolanguageacademy.com for group or family discount inquiries.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Choose your course or bundle and start learning Edo today.
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
