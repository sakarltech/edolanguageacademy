import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Register() {
  const [formData, setFormData] = useState({
    learnerName: "",
    learnerAge: "",
    parentName: "",
    email: "",
    phone: "",
    level: "",
    ageGroup: "",
    agreedToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Registration successful! Redirecting to payment...");
    setIsSubmitting(false);
    
    // In production, this would redirect to Stripe checkout
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const steps = [
    "Choose your course level and age group",
    "Fill in learner and contact details",
    "Complete secure payment via Stripe",
    "Receive confirmation and class details",
  ];

  const coursePrices: Record<string, string> = {
    beginner: "£19.99",
    intermediary: "£24.99",
    proficient: "£29.99",
    bundle: "£65.00",
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted to-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Enroll Now
            </h1>
            <p className="text-lg text-muted-foreground">
              Join our next cohort and start your Edo language learning journey today.
            </p>
          </div>
        </div>
      </section>

      {/* Enrollment Steps */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-center mb-8">
              Simple Enrollment Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-3">
                    {index + 1}
                  </div>
                  <p className="text-sm text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Registration Form</CardTitle>
                <CardDescription>
                  Please fill in all required fields to complete your enrollment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Course Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Course Selection</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="level">Course Level *</Label>
                      <Select
                        value={formData.level}
                        onValueChange={(value) => handleSelectChange("level", value)}
                        required
                      >
                        <SelectTrigger id="level">
                          <SelectValue placeholder="Select course level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner - £19.99</SelectItem>
                          <SelectItem value="intermediary">Intermediary - £24.99</SelectItem>
                          <SelectItem value="proficient">Proficient - £29.99</SelectItem>
                          <SelectItem value="bundle">Complete Bundle - £65.00 (Save £9.97!)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ageGroup">Age Group *</Label>
                      <Select
                        value={formData.ageGroup}
                        onValueChange={(value) => handleSelectChange("ageGroup", value)}
                        required
                      >
                        <SelectTrigger id="ageGroup">
                          <SelectValue placeholder="Select age group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kids">Kids (5-12 years)</SelectItem>
                          <SelectItem value="teens">Teens (13-17 years)</SelectItem>
                          <SelectItem value="adults">Adults (18+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Learner Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Learner Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="learnerName">Learner's Full Name *</Label>
                      <Input
                        id="learnerName"
                        name="learnerName"
                        value={formData.learnerName}
                        onChange={handleInputChange}
                        placeholder="First and Last Name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="learnerAge">Learner's Age *</Label>
                      <Input
                        id="learnerAge"
                        name="learnerAge"
                        type="number"
                        min="5"
                        max="120"
                        value={formData.learnerAge}
                        onChange={handleInputChange}
                        placeholder="Age"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="parentName">
                        Parent/Guardian Name {formData.ageGroup === "adults" ? "(Optional)" : "*"}
                      </Label>
                      <Input
                        id="parentName"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleInputChange}
                        placeholder="For minors: Parent/Guardian name"
                        required={formData.ageGroup !== "adults"}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (WhatsApp) *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+44 7XXX XXXXXX"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        We'll add you to the class WhatsApp group
                      </p>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreedToTerms}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, agreedToTerms: checked as boolean })
                      }
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      I agree to the terms and conditions, including the refund policy (full refund within first week, case-by-case thereafter).
                    </Label>
                  </div>

                  {/* Price Summary */}
                  {formData.level && (
                    <Card className="bg-muted">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">Total Amount:</span>
                          <span className="text-2xl font-bold text-primary">
                            {coursePrices[formData.level]}
                          </span>
                        </div>
                        {formData.level === "bundle" && (
                          <p className="text-sm text-muted-foreground">
                            You save £9.97 with the complete bundle!
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting || !formData.agreedToTerms}
                  >
                    {isSubmitting ? "Processing..." : "Proceed to Payment"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Secure payment powered by Stripe. Your payment information is encrypted and secure.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-center mb-8">
              What Happens After Enrollment?
            </h2>
            <div className="space-y-4">
              {[
                "You'll receive a confirmation email with your receipt",
                "We'll add you to your class WhatsApp group within 24 hours",
                "You'll receive the Zoom link and course materials before the first class",
                "Join us on Saturday for your first live class!",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
