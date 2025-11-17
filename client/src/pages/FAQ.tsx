import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function FAQ() {
  useScrollAnimation();
  
  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "Who can enroll in Edo Language Academy?",
          a: "Anyone aged 5 and above can enroll! We welcome Kids (5-12), Teens (13-17), and Adults (18+). All age groups attend the same class time, making it convenient for families to learn together.",
        },
        {
          q: "Do I need any prior knowledge of Edo?",
          a: "No! Our Beginner level is designed for complete beginners with no prior knowledge. If you have some experience, you can start with Intermediary or Proficient levels based on your current skill.",
        },
        {
          q: "What if I live in a different timezone?",
          a: "We offer two convenient time slots: 11 AM GMT (suitable for UK, Nigeria, Europe) and 11 AM CST (suitable for North America). You only need to attend ONE of these time slots. All classes are also recorded and available through your dashboard, so you can review or catch up if needed.",
        },
      ],
    },
    {
      category: "Classes & Schedule",
      questions: [
        {
          q: "When are classes held?",
          a: "All classes are held live on Zoom every Saturday at two time options: 11 AM GMT or 11 AM CST. You choose the time slot that works best for your timezone during registration. All age groups (Kids, Teens, Adults) attend at the same time.",
        },
        {
          q: "How long is each class?",
          a: "All classes are 60 minutes long, regardless of age group. This consistent duration ensures focused learning for everyone.",
        },
        {
          q: "Do I need to attend both time slots?",
          a: "No! You only need to attend ONE time slot per week. Choose either 11 AM GMT or 11 AM CST based on your timezone convenience. The same content is taught in both sessions.",
        },
        {
          q: "What if I miss a class?",
          a: "No problem! All classes are recorded and available through your student dashboard. You can watch the recording anytime to catch up. However, we encourage live attendance for the best interactive learning experience.",
        },
        {
          q: "When do new cohorts start?",
          a: "New cohorts start every 10 weeks. The first cohort begins on December 6, 2025, with subsequent cohorts starting regularly. Check our Schedule page for upcoming cohort dates.",
        },
        {
          q: "How many students are in each class?",
          a: "We keep class sizes small (typically 10-15 students) to ensure personalized attention, active participation, and meaningful interaction with instructors.",
        },
      ],
    },
    {
      category: "Course Structure & Curriculum",
      questions: [
        {
          q: "How long is each course?",
          a: "Each level is 8 weeks total: 6 weeks of instruction covering 4 comprehensive modules, 1 week of revision, and 1 week for final assessment.",
        },
        {
          q: "What is the module-based structure?",
          a: "Each course is divided into 4 modules, with each module spanning 1-2 weeks. Modules cover specific learning objectives like alphabets, numbers, greetings, sentence formation, cultural understanding, and more depending on your level.",
        },
        {
          q: "What happens after I complete one level?",
          a: "You'll receive a certificate of completion and can enroll in the next level to continue your learning journey. Many students progress through all three levels to achieve fluency.",
        },
        {
          q: "Can I take all three levels at once?",
          a: "No, levels must be completed sequentially (Beginner → Intermediary → Proficient) to build proper foundations. However, you can purchase the Complete Bundle upfront and save £9.97 while taking courses one at a time.",
        },
      ],
    },
    {
      category: "Learning Materials & Access",
      questions: [
        {
          q: "What materials do I get access to?",
          a: "Through your student dashboard, you'll have access to teaching notes, video lessons, interactive workbooks, practice exercises, class recordings, and assessments for each module.",
        },
        {
          q: "Can I download the materials?",
          a: "Materials are view-only and stream-only through your secure dashboard. This ensures you always have access to the latest versions and protects our intellectual property. You can access them anytime during and after your course.",
        },
        {
          q: "How long do I have access to materials?",
          a: "You have lifetime access to your course materials through your dashboard, even after completing the course. You can review lessons and materials anytime you need a refresher.",
        },
        {
          q: "Are there homework assignments?",
          a: "Yes! Each module includes practice exercises and workbooks to reinforce your learning. These are accessible through your dashboard and help prepare you for assessments.",
        },
      ],
    },
    {
      category: "Payment & Pricing",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure Stripe payment system.",
        },
        {
          q: "How much does each course cost?",
          a: "Beginner: £19.99, Intermediary: £24.99, Proficient: £29.99. Or get all three levels in our Complete Bundle for £65 (save £9.97).",
        },
        {
          q: "Is there a discount for multiple children?",
          a: "Yes! Contact us at support@edolanguageacademy.com for family and group discounts when enrolling multiple family members.",
        },
        {
          q: "What is your refund policy?",
          a: "We offer a full refund within the first week if you're not satisfied. After that, refunds are considered on a case-by-case basis.",
        },
        {
          q: "Can I pay in installments?",
          a: "Currently, we require full payment upfront. However, you can enroll in courses individually (rather than the bundle) to spread the cost across time.",
        },
      ],
    },
    {
      category: "Assessment & Certification",
      questions: [
        {
          q: "How is the final assessment conducted?",
          a: "The assessment consists of an oral component (40%) and 30 multiple-choice questions (60%), conducted online in Week 8. You'll demonstrate your speaking skills and knowledge of the curriculum.",
        },
        {
          q: "What if I don't pass the assessment?",
          a: "You can retake the same level in the next cohort at 50% of the regular fee. We're here to support your learning journey until you succeed.",
        },
        {
          q: "How do I receive my certificate?",
          a: "After successfully completing your assessment, your instructor will generate your certificate. You'll receive it via email and can also download it from your dashboard.",
        },
        {
          q: "Is the certificate recognized?",
          a: "Yes, you'll receive an official certificate of completion from Edo Language Academy, demonstrating your proficiency level in the Edo language.",
        },
      ],
    },
    {
      category: "Technical Requirements",
      questions: [
        {
          q: "What do I need to attend classes?",
          a: "You'll need a computer, tablet, or smartphone with a stable internet connection, a webcam, and a microphone. Classes are held on Zoom (free to join).",
        },
        {
          q: "Do I need to install any software?",
          a: "You'll need Zoom installed on your device to attend live classes. All course materials are accessed through your web browser on our platform—no additional software required.",
        },
        {
          q: "What if I have technical issues during class?",
          a: "Our instructors are available to help with technical issues. You can also contact support@edolanguageacademy.com. Remember, all classes are recorded, so you won't miss content if you experience temporary issues.",
        },
      ],
    },
    {
      category: "Community & Support",
      questions: [
        {
          q: "Is there a community for students?",
          a: "Yes! Each course has a dedicated WhatsApp group where you can connect with fellow learners, practice together, ask questions, and share your progress.",
        },
        {
          q: "Can I ask questions outside of class time?",
          a: "Absolutely! You can post questions in the discussion forum on your dashboard, where instructors and fellow students can help. You can also reach out via the WhatsApp group.",
        },
        {
          q: "How do I contact support?",
          a: "You can email us at support@edolanguageacademy.com, use the contact form on our website, or reach out through the Efosa chatbot for quick answers.",
        },
      ],
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted to-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our courses, schedule, and learning experience.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="scroll-fade-in">
                <h2 className="text-2xl font-display font-bold mb-6 text-primary">
                  {category.category}
                </h2>
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

      {/* Still Have Questions */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Can't find the answer you're looking for? Our friendly Efosa chatbot or support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:support@edolanguageacademy.com">
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors">
                  Email Support
                </button>
              </a>
              <a href="/contact">
                <button className="px-8 py-3 bg-background text-foreground border border-border rounded-md font-semibold hover:bg-muted transition-colors">
                  Contact Us
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
