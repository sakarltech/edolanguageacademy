import { notifyOwner } from "./notification";

/**
 * Send email notification to a student
 * In production, this would integrate with an email service like SendGrid, Mailgun, etc.
 * For now, we'll notify the owner about the email that should be sent
 */
export async function sendStudentEmail(params: {
  to: string;
  subject: string;
  body: string;
  studentName?: string;
}) {
  // In production, integrate with email service:
  // await sendgrid.send({ to: params.to, subject: params.subject, html: params.body });
  
  // For now, notify owner about the email
  await notifyOwner({
    title: `Email Notification: ${params.subject}`,
    content: `To: ${params.to}\nStudent: ${params.studentName || "N/A"}\n\n${params.body}`,
  });

  return { success: true };
}

/**
 * Send class reminder email (24 hours before class)
 */
export async function sendClassReminder(params: {
  email: string;
  studentName: string;
  courseLevel: string;
  classDate: Date;
  classTime: string;
}) {
  const subject = "Reminder: Your Edo Language Class is Tomorrow!";
  const body = `
Hi ${params.studentName},

This is a friendly reminder that your ${params.courseLevel} Edo language class is scheduled for tomorrow!

📅 Date: ${params.classDate.toLocaleDateString()}
⏰ Time: ${params.classTime}
🔗 Join via Zoom (link will be sent separately)

Please make sure you:
✓ Have your learning materials ready
✓ Test your audio and video before class
✓ Review last week's content if possible

We're excited to see you in class!

Best regards,
Edo Language Academy Team
  `.trim();

  return sendStudentEmail({
    to: params.email,
    subject,
    body,
    studentName: params.studentName,
  });
}

/**
 * Send weekly progress summary
 */
export async function sendWeeklyProgressSummary(params: {
  email: string;
  studentName: string;
  courseLevel: string;
  currentWeek: number;
  completedWeeks: number;
  attendanceCount: number;
}) {
  const subject = "Your Weekly Progress Summary";
  const progressPercentage = Math.round((params.completedWeeks / 8) * 100);

  const body = `
Hi ${params.studentName},

Here's your weekly progress summary for the ${params.courseLevel} course:

📊 Progress Overview:
• Current Week: ${params.currentWeek}/8
• Completed Weeks: ${params.completedWeeks}/8 (${progressPercentage}%)
• Attendance: ${params.attendanceCount}/8 classes

${params.completedWeeks < params.currentWeek ? "⚠️ You have incomplete weeks. Please catch up on missed content in your dashboard." : "✅ Great job staying on track!"}

Keep up the excellent work! Visit your dashboard to access course materials and track your progress.

🔗 Dashboard: https://edolanguageacademy.com/dashboard

Best regards,
Edo Language Academy Team
  `.trim();

  return sendStudentEmail({
    to: params.email,
    subject,
    body,
    studentName: params.studentName,
  });
}

/**
 * Send incomplete week alert
 */
export async function sendIncompleteWeekAlert(params: {
  email: string;
  studentName: string;
  courseLevel: string;
  incompleteWeeks: number[];
}) {
  const subject = "Action Required: Complete Your Course Weeks";
  const weeksList = params.incompleteWeeks.join(", ");

  const body = `
Hi ${params.studentName},

We noticed you have some incomplete weeks in your ${params.courseLevel} course:

📝 Incomplete Weeks: ${weeksList}

To stay on track and get the most out of your learning experience, please:
1. Review the materials for these weeks in your dashboard
2. Complete any pending activities or assessments
3. Mark the weeks as complete once you're done

Don't fall behind! Consistent practice is key to mastering the Edo language.

🔗 Access Your Dashboard: https://edolanguageacademy.com/dashboard

Need help? Reply to this email or contact us at support@edolanguageacademy.com

Best regards,
Edo Language Academy Team
  `.trim();

  return sendStudentEmail({
    to: params.email,
    subject,
    body,
    studentName: params.studentName,
  });
}

/**
 * Send milestone congratulations email
 */
export async function sendMilestoneCongratulations(params: {
  email: string;
  studentName: string;
  courseLevel: string;
  milestone: "halfway" | "completed" | "certificate";
  assessmentScore?: number;
}) {
  let subject = "";
  let body = "";

  switch (params.milestone) {
    case "halfway":
      subject = "🎉 Congratulations! You're Halfway Through!";
      body = `
Hi ${params.studentName},

Congratulations! You've completed 4 weeks of your ${params.courseLevel} Edo language course! 🎉

You're halfway to fluency! This is a significant achievement and we're proud of your dedication.

Keep up the momentum:
✓ Continue attending classes regularly
✓ Practice speaking Edo with fellow students
✓ Review materials from previous weeks

You're doing great! Only 4 more weeks to go!

Best regards,
Edo Language Academy Team
      `.trim();
      break;

    case "completed":
      subject = "🎓 Course Completed! Congratulations!";
      body = `
Hi ${params.studentName},

Congratulations! You've successfully completed the ${params.courseLevel} Edo language course! 🎓

${params.assessmentScore ? `Your final assessment score: ${params.assessmentScore}%` : ""}

This is a remarkable achievement! You've dedicated 8 weeks to learning and preserving the Edo language, and we're incredibly proud of you.

What's next:
${params.assessmentScore && params.assessmentScore >= 70 ? "✓ Your certificate is being prepared and will be available in your dashboard soon" : "• Complete your final assessment to receive your certificate"}
✓ Continue practicing to maintain your skills
✓ Consider enrolling in the next level to advance further
✓ Join our community forum to stay connected

Thank you for being part of Edo Language Academy!

Best regards,
Edo Language Academy Team
      `.trim();
      break;

    case "certificate":
      subject = "📜 Your Certificate is Ready!";
      body = `
Hi ${params.studentName},

Great news! Your certificate of completion for the ${params.courseLevel} Edo language course is now ready! 📜

You can download your certificate from your dashboard:
🔗 https://edolanguageacademy.com/dashboard

Share your achievement with friends and family, and be proud of your dedication to preserving the Edo language!

Congratulations once again!

Best regards,
Edo Language Academy Team
      `.trim();
      break;
  }

  return sendStudentEmail({
    to: params.email,
    subject,
    body,
    studentName: params.studentName,
  });
}
