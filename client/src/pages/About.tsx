import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Target, Users, Globe } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Cultural Preservation",
      description: "We are dedicated to keeping the Edo language and heritage alive for future generations.",
    },
    {
      icon: Target,
      title: "Excellence in Teaching",
      description: "Our structured curriculum and native instructors ensure quality learning outcomes.",
    },
    {
      icon: Users,
      title: "Community Building",
      description: "We foster a supportive community where learners connect and grow together.",
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Making Edo language education accessible to diaspora families worldwide.",
    },
  ];

  return (
    <Layout>
      <section className="bg-gradient-to-b from-muted to-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <img 
                src="/edo-logo.png" 
                alt="Edo Language Academy Logo" 
                className="w-48 h-48 md:w-64 md:h-64 object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              About Edo Language Academy
            </h1>
            <p className="text-lg text-muted-foreground">
              Reconnecting diaspora families with their heritage through structured, engaging online Edo language education.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-8">Our Mission</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg text-muted-foreground mb-4">
                  Edo Language Academy (ELA) is an online platform helping Edo (Bini) children, teens, and adults—especially in the diaspora—to speak, read, and write Edo confidently.
                </p>
                <p className="text-lg text-muted-foreground">
                  We provide a warm, structured, modern online academy that makes Edo easy, fun, and consistent so families keep their heritage alive, together. Through live Saturday classes, comprehensive recordings, and supportive community groups, we ensure every learner can progress at their own pace while staying connected to their cultural roots.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-12">Why We Exist</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>The Challenge</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Diaspora families want their children to retain Edo language and identity, but lack structured instruction, materials, and community to foster learning. Parents often cannot teach consistently due to time constraints, pronunciation challenges, or confidence. Schools rarely offer Edo, so children lose fluency and cultural connection.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Our Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We provide structured, accessible online classes with native instructors, comprehensive materials, and a supportive community. Our 8-week programmes are designed for all ages and skill levels, making it easy for families to learn together and maintain their heritage.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <Card key={value.title}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle>{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">Who We Serve</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We serve Edo families across the UK, Europe, North America, Nigeria, and around the world, providing structured online learning for:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kids</CardTitle>
                  <p className="text-2xl font-bold text-primary">5-12 years</p>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Teens</CardTitle>
                  <p className="text-2xl font-bold text-primary">13-17 years</p>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Adults</CardTitle>
                  <p className="text-2xl font-bold text-primary">18+ years</p>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
