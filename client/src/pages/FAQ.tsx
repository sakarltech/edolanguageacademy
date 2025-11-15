import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FAQ() {
  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "Who can enroll in Edo Language Academy?",
          a: "Anyone aged 5 and above can enroll! We have age-specific cohorts for Kids (5-12), Teens (13-17), and Adults (18+).",
        },
        {
          q: "Do I need any prior knowledge of Edo?",
          a: "No! Our Beginner level is designed for complete beginners. If you have some knowledge, you can start with Intermediary or Proficient levels.",
        },
        {
          q: "What if I live in a different timezone?",
          a: "All classes are recorded and available for 30 days after the course ends, so you can learn at your own pace even if you can\'t attend live.",
        },
      ],
    },
    {
      category: "Classes & Schedule",
      questions: [
        {
          q: "When are classes held?",
          a: "All classes are held live on Zoom every Saturday. Times vary by age group: Kids at 10:00 AM UK, Teens at 12:00 PM UK, and Adults at 2:00 PM UK.",
        },
        {
          q: "How long is each class?",
          a: "Kids classes are 60 minutes, while Teens and Adults classes are 75 minutes.",
        },
        {
          q: "What if I miss a class?",
          a: "No problem! All classes are recorded and you\'ll receive a link to catch up. However, we encourage live attendance for the best learning experience.",
        },
        {
          q: "How many students are in each class?",
          a: "We keep class sizes small to ensure personalized attention and active participation.",
        },
      ],
    },
    {
      category: "Course Structure",
      questions: [
        {
          q: "How long is each course?",
          a: "Each level is 8 weeks: 6 weeks of instruction, 1 week of revision, and 1 week for final assessment.",
        },
        {
          q: "What happens after I complete one level?",
          a: "You\'ll receive a certificate and can enroll in the next level to continue your learning journey.",
        },
        {
          q: "Can I take all three levels at once?",
          a: "No, levels must be completed sequentially. However, you can purchase the bundle upfront and save money.",
        },
      ],
    },
    {
      category: "Payment & Pricing",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit and debit cards through our secure Stripe payment system.",
        },
        {
          q: "Is there a discount for multiple children?",
          a: "Yes! Contact us at support@edolanguageacademy.com for family and group discounts.",
        },
        {
          q: "What is your refund policy?",
          a: "We offer a full refund within the first week if you\'re not satisfied. After that, refunds are considered on a case-by-case basis.",
        },
        {
          q: "Can I pay in installments?",
          a: "Currently, we require full payment upfront. However, you can enroll in courses individually to spread the cost.",
        },
      ],
    },
    {
      category: "Assessment & Certification",
      questions: [
        {
          q: "How is the final assessment conducted?",
          a: "The assessment consists of an oral component (40%) and 30 multiple-choice questions (60%), conducted online in Week 8.",
        },
        {
          q: "What if I don\'t pass the assessment?",
          a: "You can retake the same level in the next cycle at 50% of the regular fee.",
        },
        {
          q: "Is the certificate recognized?",
          a: "Yes, you\'ll receive an official certificate of completion from Edo Language Academy.",
        },
      ],
    },
    {
      category: "Technical Requirements",
      questions: [
        {
          q: "What do I need to attend classes?",
          a: "You\'ll need a device (computer, tablet, or smartphone) with internet access, a Zoom account, and WhatsApp for communication.",
        },
        {
          q: "Do I need to download any special software?",
          a: "Just Zoom for live classes and WhatsApp for community groups and updates.",
        },
      ],
    },
  ];

  return (
    <Layout>
      <section className="bg-gradient-to-b from-muted to-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our courses, schedule, and enrollment process.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqs.map((category, index) => (
              <div key={index}>
                <h2 className="text-2xl font-display font-bold mb-6">{category.category}</h2>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <Card key={faqIndex}>
                      <CardHeader>
                        <CardTitle className="text-lg">{faq.q}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{faq.a}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
