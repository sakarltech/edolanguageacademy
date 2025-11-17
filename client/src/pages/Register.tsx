import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Register() {
  const handleGoogleSignUp = () => {
    // Redirect to Manus OAuth login (which handles registration too)
    window.location.href = getLoginUrl();
  };

  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-display">Create Your Account</CardTitle>
              <CardDescription>
                Join Edo Language Academy and start your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Sign Up */}
              <Button 
                onClick={handleGoogleSignUp}
                variant="outline" 
                className="w-full"
                type="button"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or sign up with Manus
                  </span>
                </div>
              </div>

              {/* Manus OAuth Sign Up */}
              <Button 
                onClick={handleGoogleSignUp}
                className="w-full"
                type="button"
              >
                Sign Up with Manus
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Already have an account?{" "}
                  <Link href="/dashboard" className="text-primary hover:underline font-medium">
                    Log in
                  </Link>
                </p>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                By creating an account, you agree to our{" "}
                <a href="#" className="underline hover:text-primary">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-primary">
                  Privacy Policy
                </a>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p className="mb-2">After creating your account, you'll be able to:</p>
            <ul className="space-y-1">
              <li>✓ Browse and select your course level</li>
              <li>✓ Access your personalized dashboard</li>
              <li>✓ Track your learning progress</li>
              <li>✓ Join our community discussions</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
