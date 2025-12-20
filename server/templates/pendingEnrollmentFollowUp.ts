/**
 * Email template for following up on pending enrollments after 24 hours
 */

export interface PendingEnrollmentEmailData {
  learnerName: string;
  courseLevel: string;
  userEmail: string;
}

export function generatePendingEnrollmentFollowUpEmail(data: PendingEnrollmentEmailData) {
  const { learnerName, courseLevel, userEmail } = data;
  
  const courseLevelDisplay = courseLevel === 'beginner' ? 'Beginner' 
    : courseLevel === 'intermediary' ? 'Intermediary'
    : courseLevel === 'proficient' ? 'Proficient'
    : 'Bundle (All Levels)';

  const subject = `Complete Your Enrollment - ${courseLevelDisplay} Level Edo Language Course`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Your Enrollment</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFF8F0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #8B2500 0%, #B91C1C 50%, #8B2500 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 28px; font-weight: bold;">
                Òb'okhian! 👋
              </h1>
              <p style="color: #FEF3C7; margin: 0; font-size: 16px;">
                We noticed you started enrolling...
              </p>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #1F2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hello ${learnerName},
              </p>

              <p style="color: #1F2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                We noticed that you started enrolling in our <strong>${courseLevelDisplay} Level</strong> Edo Language course but haven't completed your payment yet. We wanted to reach out and see if there's anything we can help you with!
              </p>

              <p style="color: #1F2937; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Learning Edo is an exciting journey, and we're here to support you every step of the way. Whether you have questions about the course content, schedule, payment options, or anything else, we're happy to help.
              </p>

              <!-- Help options box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FFF8F0; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #C17817;">
                <tr>
                  <td style="padding: 25px;">
                    <h3 style="color: #8B2500; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">
                      Need Help? We're Here for You!
                    </h3>
                    <p style="color: #4B5563; font-size: 15px; line-height: 1.6; margin: 0 0 15px 0;">
                      <strong>💬 Chat with Efosa:</strong> Our AI assistant Efosa is available 24/7 on our website to answer your questions instantly. Just click the chat icon on any page!
                    </p>
                    <p style="color: #4B5563; font-size: 15px; line-height: 1.6; margin: 0;">
                      <strong>📧 Email Us:</strong> Simply reply to this email and our team will get back to you within 24 hours.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Course benefits reminder -->
              <h3 style="color: #8B2500; font-size: 20px; margin: 0 0 20px 0; font-weight: bold;">
                What You'll Get:
              </h3>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 12px 0;">
                    <p style="color: #1F2937; font-size: 15px; margin: 0; line-height: 1.5;">
                      ✅ <strong>Live Interactive Classes</strong> every Saturday with expert instructors
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <p style="color: #1F2937; font-size: 15px; margin: 0; line-height: 1.5;">
                      ✅ <strong>Structured 8-Week Curriculum</strong> across 4 comprehensive modules
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <p style="color: #1F2937; font-size: 15px; margin: 0; line-height: 1.5;">
                      ✅ <strong>Access to Course Materials</strong> including videos, worksheets, and recordings
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <p style="color: #1F2937; font-size: 15px; margin: 0; line-height: 1.5;">
                      ✅ <strong>WhatsApp Community</strong> to practice with fellow learners
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <p style="color: #1F2937; font-size: 15px; margin: 0; line-height: 1.5;">
                      ✅ <strong>Certificate of Completion</strong> upon successfully finishing the course
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://www.edolanguageacademy.com/dashboard" style="background: linear-gradient(135deg, #8B2500 0%, #B91C1C 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block; box-shadow: 0 4px 8px rgba(139, 37, 0, 0.3);">
                      Complete Your Enrollment
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center; font-style: italic;">
                Your spot is waiting for you! We can't wait to welcome you to our vibrant community of Edo language learners.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FFF8F0; padding: 30px; text-align: center; border-top: 2px solid #C17817;">
              <p style="color: #8B2500; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">
                Urhuese! 🙏
              </p>
              <p style="color: #6B7280; font-size: 14px; margin: 0 0 20px 0;">
                The Edo Language Academy Team
              </p>
              <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                📧 Questions? Reply to this email or chat with Efosa on our website<br>
                🌐 <a href="https://www.edolanguageacademy.com" style="color: #B91C1C; text-decoration: none;">www.edolanguageacademy.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
Òb'okhian! 👋

Hello ${learnerName},

We noticed that you started enrolling in our ${courseLevelDisplay} Level Edo Language course but haven't completed your payment yet. We wanted to reach out and see if there's anything we can help you with!

Learning Edo is an exciting journey, and we're here to support you every step of the way. Whether you have questions about the course content, schedule, payment options, or anything else, we're happy to help.

NEED HELP? WE'RE HERE FOR YOU!

💬 Chat with Efosa: Our AI assistant Efosa is available 24/7 on our website to answer your questions instantly. Just click the chat icon on any page!

📧 Email Us: Simply reply to this email and our team will get back to you within 24 hours.

WHAT YOU'LL GET:

✅ Live Interactive Classes every Saturday with expert instructors
✅ Structured 8-Week Curriculum across 4 comprehensive modules
✅ Access to Course Materials including videos, worksheets, and recordings
✅ WhatsApp Community to practice with fellow learners
✅ Certificate of Completion upon successfully finishing the course

👉 Complete your enrollment at: https://www.edolanguageacademy.com/dashboard

Your spot is waiting for you! We can't wait to welcome you to our vibrant community of Edo language learners.

Urhuese! 🙏
The Edo Language Academy Team

Questions? Reply to this email or chat with Efosa on our website
🌐 www.edolanguageacademy.com
  `;

  return { subject, html, text };
}
