import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Clock,
  Calendar,
  User,
  Target,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Video,
} from "lucide-react";
import { Link } from "wouter";

export default function PrivateClasses() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F0] to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4">
          <Link href="/">
            <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
              <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10" />
              <span className="text-xl font-bold text-[#8B2500]">{APP_TITLE}</span>
            </div>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/pricing" className="text-gray-700 hover:text-[#8B2500] transition-colors">
              Pricing
            </Link>
            <Link href="/schedule" className="text-gray-700 hover:text-[#8B2500] transition-colors">
              Schedule
            </Link>
            {isAuthenticated ? (
              <Button variant="default" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild variant="default">
                <a href={getLoginUrl()}>Enroll Now</a>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-[#8B2500]/10 text-[#8B2500] px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Personalized Learning Experience</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#8B2500] mb-6">
            Private Edo Language Classes
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Learn Edo at your own pace with one-on-one instruction tailored to your schedule,
            goals, and learning speed. Get personalized attention from expert instructors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/dashboard">Book Private Class</Link>
              </Button>
            ) : (
              <Button size="lg" className="text-lg px-8" asChild>
                <a href={getLoginUrl()}>Get Started</a>
              </Button>
            )}
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/pricing">View All Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-12 px-4">
        <div className="container max-w-md">
          <Card className="border-2 border-[#C17817] shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8B2500]/10 rounded-full mb-4">
                <User className="w-8 h-8 text-[#8B2500]" />
              </div>
              <h3 className="text-2xl font-bold text-[#8B2500] mb-2">Private Class</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-[#8B2500]">£49.99</span>
                <p className="text-gray-600 mt-2">One-time payment</p>
              </div>
              <div className="space-y-3 text-left mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">8 one-hour sessions (1 class/week)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Or 4 weeks (2 classes/week)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Flexible schedule - you choose!</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Personalized curriculum</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">One-on-one instructor attention</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">All course materials included</span>
                </div>
              </div>
              {isAuthenticated ? (
                <Button size="lg" className="w-full" asChild>
                  <Link href="/dashboard">Book Now</Link>
                </Button>
              ) : (
                <Button size="lg" className="w-full" asChild>
                  <a href={getLoginUrl()}>Book Now</a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold text-[#8B2500] text-center mb-12">
            How Private Classes Work
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#8B2500] text-white rounded-full mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-[#8B2500] mb-3">Book & Pay</h3>
                <p className="text-gray-600">
                  Enroll and complete payment securely through our platform. You'll receive
                  instant confirmation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#8B2500] text-white rounded-full mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-[#8B2500] mb-3">Tell Us Your Goals</h3>
                <p className="text-gray-600">
                  Reply to your confirmation email with your learning goals, preferred schedule,
                  and frequency (1x or 2x per week).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#8B2500] text-white rounded-full mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-[#8B2500] mb-3">Start Learning</h3>
                <p className="text-gray-600">
                  We'll match you with an instructor and coordinate your personalized class
                  schedule. Begin your journey!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold text-[#8B2500] text-center mb-12">
            Why Choose Private Classes?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-[#C17817]">
              <CardContent className="p-6 flex gap-4">
                <Clock className="w-8 h-8 text-[#8B2500] flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-[#8B2500] mb-2">Flexible Schedule</h3>
                  <p className="text-gray-600">
                    Choose class times that fit your busy life. Morning, afternoon, evening, or
                    weekend - you decide!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#C17817]">
              <CardContent className="p-6 flex gap-4">
                <Target className="w-8 h-8 text-[#8B2500] flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-[#8B2500] mb-2">Personalized Curriculum</h3>
                  <p className="text-gray-600">
                    Lessons tailored to your specific goals, whether it's conversational fluency,
                    cultural understanding, or professional use.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#C17817]">
              <CardContent className="p-6 flex gap-4">
                <User className="w-8 h-8 text-[#8B2500] flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-[#8B2500] mb-2">Individual Attention</h3>
                  <p className="text-gray-600">
                    Get 100% of your instructor's focus. Ask questions anytime and progress at
                    your own pace.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#C17817]">
              <CardContent className="p-6 flex gap-4">
                <Calendar className="w-8 h-8 text-[#8B2500] flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-[#8B2500] mb-2">Choose Your Pace</h3>
                  <p className="text-gray-600">
                    Want to learn faster? Take 2 classes per week. Prefer a slower pace? One class
                    per week works perfectly.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#C17817]">
              <CardContent className="p-6 flex gap-4">
                <Video className="w-8 h-8 text-[#8B2500] flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-[#8B2500] mb-2">Online Convenience</h3>
                  <p className="text-gray-600">
                    Learn from anywhere with live video classes. No commute, no hassle - just
                    quality instruction.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#C17817]">
              <CardContent className="p-6 flex gap-4">
                <MessageCircle className="w-8 h-8 text-[#8B2500] flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-[#8B2500] mb-2">Direct Communication</h3>
                  <p className="text-gray-600">
                    Build a relationship with your instructor. Get feedback, guidance, and support
                    throughout your journey.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-4xl font-bold text-[#8B2500] text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#8B2500] mb-2">
                  How many classes do I get?
                </h3>
                <p className="text-gray-600">
                  You get 8 one-hour private sessions. You can take them once per week (8 weeks
                  total) or twice per week (4 weeks total) - completely up to you!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#8B2500] mb-2">
                  What happens after I pay?
                </h3>
                <p className="text-gray-600">
                  You'll receive a confirmation email asking for your learning goals, preferred
                  schedule, frequency, and timezone. Simply reply with this information and we'll
                  coordinate everything for you.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#8B2500] mb-2">
                  Can I choose my class times?
                </h3>
                <p className="text-gray-600">
                  Absolutely! That's the beauty of private classes. Tell us your availability and
                  we'll work with you to find times that fit your schedule perfectly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#8B2500] mb-2">
                  What level can I start at?
                </h3>
                <p className="text-gray-600">
                  Private classes work for all levels - complete beginner, intermediary, or
                  proficient. Your instructor will assess your level and customize the curriculum
                  accordingly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#8B2500] mb-2">
                  How quickly will classes start?
                </h3>
                <p className="text-gray-600">
                  Once you provide your schedule preferences, we typically match you with an
                  instructor and start classes within 3-5 business days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#8B2500] to-[#B91C1C]">
        <div className="container max-w-3xl text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Private Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join students who are learning Edo on their own terms with personalized instruction.
          </p>
          {isAuthenticated ? (
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link href="/dashboard">Book Private Class Now</Link>
            </Button>
          ) : (
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <a href={getLoginUrl()}>Get Started Today</a>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#8B2500] text-white py-8">
        <div className="container text-center">
          <p>&copy; 2026 {APP_TITLE}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
