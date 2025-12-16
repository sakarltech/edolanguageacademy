import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, Mail, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "wouter";

export default function Unsubscribe() {
  const params = useParams<{ token: string }>();
  const token = params.token || "";
  const [unsubscribed, setUnsubscribed] = useState(false);

  const { data: tokenData, isLoading: verifying } = trpc.marketing.verifyUnsubscribeToken.useQuery(
    { token },
    { enabled: !!token }
  );

  const unsubscribeMutation = trpc.marketing.unsubscribe.useMutation({
    onSuccess: () => {
      setUnsubscribed(true);
    },
  });

  const handleUnsubscribe = () => {
    unsubscribeMutation.mutate({ token });
  };

  // Loading state
  if (verifying) {
    return (
      <Layout>
        <div className="container py-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
              <p>Verifying your request...</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Invalid token
  if (!tokenData?.valid) {
    return (
      <Layout>
        <div className="container py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <XCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
              <CardTitle>Invalid Link</CardTitle>
              <CardDescription>
                This unsubscribe link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                If you believe this is an error, please contact us at{" "}
                <a href="mailto:support@edolanguageacademy.com" className="text-primary hover:underline">
                  support@edolanguageacademy.com
                </a>
              </p>
              <Button asChild variant="outline">
                <a href="/">Return to Homepage</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Already unsubscribed
  if (tokenData.alreadyUnsubscribed || unsubscribed) {
    return (
      <Layout>
        <div className="container py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
              <CardTitle>You're Unsubscribed</CardTitle>
              <CardDescription>
                {tokenData.email} has been removed from our mailing list.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                You will no longer receive marketing emails from Edo Language Academy.
                Note that you may still receive transactional emails related to your account or enrollments.
              </p>
              <div className="space-y-2">
                <Button asChild>
                  <a href="/">Return to Homepage</a>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Changed your mind?{" "}
                  <a href="mailto:support@edolanguageacademy.com" className="text-primary hover:underline">
                    Contact us
                  </a>{" "}
                  to resubscribe.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Confirmation page
  return (
    <Layout>
      <div className="container py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <Mail className="h-16 w-16 mx-auto text-primary mb-4" />
            <CardTitle>Unsubscribe from Emails</CardTitle>
            <CardDescription>
              You're about to unsubscribe {tokenData.email} from our mailing list.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-yellow-800">
                    Are you sure?
                  </p>
                  <p className="text-xs text-yellow-700">
                    You'll miss out on class updates, special offers, and Edo language learning tips.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={handleUnsubscribe}
                disabled={unsubscribeMutation.isPending}
                variant="destructive"
                className="w-full"
              >
                {unsubscribeMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Yes, Unsubscribe Me"
                )}
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="/">No, Keep Me Subscribed</a>
              </Button>
            </div>
            
            {unsubscribeMutation.isError && (
              <p className="text-sm text-red-500 mt-4">
                Something went wrong. Please try again or contact support.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
