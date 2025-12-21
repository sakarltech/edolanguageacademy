/**
 * Private Class Enrollment Confirmation Email Template
 * Sent after successful payment to request scheduling preferences
 */

export interface PrivateClassConfirmationData {
  learnerName: string;
  email: string;
  phone: string;
}

export function generatePrivateClassConfirmationEmail(data: PrivateClassConfirmationData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "🎉 Private Class Confirmed - Let's Schedule Your Sessions!";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Private Class Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFF8F0;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #8B2500 0%, #B91C1C 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                🎉 Private Class Confirmed!
              </h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 30px 20px;">
              <p style="margin: 0 0 15px; font-size: 16px; line-height: 1.6; color: #333333;">
                <strong>Òb'okhian, ${data.learnerName}! 👋</strong>
              </p>
              <p style="margin: 0 0 15px; font-size: 16px; line-height: 1.6; color: #333333;">
                Congratulations! Your payment has been successfully processed and your private Edo language class is confirmed.
              </p>
            </td>
          </tr>

          <!-- What You Get -->
          <tr>
            <td style="padding: 0 30px 20px;">
              <div style="background-color: #FFF8F0; border-left: 4px solid #C17817; padding: 20px; border-radius: 8px;">
                <h2 style="margin: 0 0 15px; font-size: 20px; color: #8B2500;">
                  📚 Your Private Class Package
                </h2>
                <ul style="margin: 0; padding-left: 20px; color: #333333; line-height: 1.8;">
                  <li><strong>8 one-hour private sessions</strong> with expert instructor</li>
                  <li><strong>Flexible scheduling</strong> - Choose 1x or 2x per week</li>
                  <li><strong>Personalized curriculum</strong> tailored to your goals</li>
                  <li><strong>All course materials</strong> included</li>
                  <li><strong>Individual attention</strong> and immediate feedback</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Next Steps -->
          <tr>
            <td style="padding: 0 30px 20px;">
              <h2 style="margin: 0 0 15px; font-size: 20px; color: #8B2500;">
                📅 Next Step: Schedule Your Classes
              </h2>
              <p style="margin: 0 0 15px; font-size: 16px; line-height: 1.6; color: #333333;">
                To coordinate your personalized class schedule, please <strong>reply to this email</strong> with the following information:
              </p>
              <div style="background-color: #ffffff; border: 2px solid #C17817; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <ol style="margin: 0; padding-left: 20px; color: #333333; line-height: 2;">
                  <li><strong>Your Learning Goals:</strong> What do you want to achieve? (e.g., conversational fluency, cultural understanding, professional use)</li>
                  <li><strong>Preferred Schedule:</strong> What days and times work best for you?</li>
                  <li><strong>Class Frequency:</strong> Would you prefer 1 class per week (8 weeks total) or 2 classes per week (4 weeks total)?</li>
                  <li><strong>Your Timezone:</strong> To ensure we schedule at the right time for you</li>
                  <li><strong>Your Current Level:</strong> Complete beginner, some knowledge, or advanced?</li>
                  <li><strong>Any Special Requests:</strong> Specific topics, learning pace preferences, etc.</li>
                </ol>
              </div>
            </td>
          </tr>

          <!-- Help Options -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #F0F9FF; border-left: 4px solid #3B82F6; padding: 20px; border-radius: 8px;">
                <h3 style="margin: 0 0 10px; font-size: 18px; color: #1E40AF;">
                  💬 Need Help?
                </h3>
                <p style="margin: 0 0 10px; font-size: 15px; line-height: 1.6; color: #333333;">
                  <strong>Chat with Efosa:</strong> Visit our website and chat with Efosa, our AI assistant, available 24/7 to answer any questions.
                </p>
                <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #333333;">
                  <strong>Email Us:</strong> Simply reply to this email and we'll respond within 24 hours.
                </p>
              </div>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <a href="mailto:info@edolanguageacademy.com?subject=Private Class Scheduling - ${encodeURIComponent(data.learnerName)}&body=Hi! I'd like to schedule my private Edo language classes.%0D%0A%0D%0AMy Learning Goals:%0D%0A%0D%0APreferred Schedule:%0D%0A%0D%0AClass Frequency (1x or 2x per week):%0D%0A%0D%0AMy Timezone:%0D%0A%0D%0ACurrent Level:%0D%0A%0D%0ASpecial Requests:" 
                 style="display: inline-block; background: linear-gradient(135deg, #8B2500 0%, #B91C1C 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: bold; margin: 10px 0;">
                📧 Reply to Schedule Now
              </a>
            </td>
          </tr>

          <!-- What Happens Next -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h3 style="margin: 0 0 15px; font-size: 18px; color: #8B2500;">
                ⏭️ What Happens Next?
              </h3>
              <ol style="margin: 0; padding-left: 20px; color: #333333; line-height: 1.8;">
                <li>Reply to this email with your scheduling preferences</li>
                <li>We'll match you with an expert instructor within 2-3 business days</li>
                <li>You'll receive your personalized class schedule and meeting links</li>
                <li>Start your private Edo language journey!</li>
              </ol>
            </td>
          </tr>

          <!-- Contact Info -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">
                <strong>Your Contact Information:</strong><br>
                Email: ${data.email}<br>
                Phone: ${data.phone}
              </p>
              <p style="margin: 0; font-size: 14px; color: #666666; font-style: italic;">
                If any of this information is incorrect, please let us know in your reply.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #8B2500; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="margin: 0 0 10px; color: #ffffff; font-size: 18px; font-weight: bold;">
                Urhuese! 🙏
              </p>
              <p style="margin: 0 0 15px; color: #ffffff; font-size: 14px; opacity: 0.9;">
                We're excited to guide you on your Edo language journey!
              </p>
              <p style="margin: 0; color: #ffffff; font-size: 12px; opacity: 0.8;">
                © 2026 Edo Language Academy. All rights reserved.
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
Òb'okhian, ${data.learnerName}! 👋

PRIVATE CLASS CONFIRMED!

Congratulations! Your payment has been successfully processed and your private Edo language class is confirmed.

YOUR PRIVATE CLASS PACKAGE:
- 8 one-hour private sessions with expert instructor
- Flexible scheduling - Choose 1x or 2x per week
- Personalized curriculum tailored to your goals
- All course materials included
- Individual attention and immediate feedback

NEXT STEP: SCHEDULE YOUR CLASSES

To coordinate your personalized class schedule, please reply to this email with:

1. Your Learning Goals: What do you want to achieve? (e.g., conversational fluency, cultural understanding, professional use)
2. Preferred Schedule: What days and times work best for you?
3. Class Frequency: Would you prefer 1 class per week (8 weeks total) or 2 classes per week (4 weeks total)?
4. Your Timezone: To ensure we schedule at the right time for you
5. Your Current Level: Complete beginner, some knowledge, or advanced?
6. Any Special Requests: Specific topics, learning pace preferences, etc.

NEED HELP?
- Chat with Efosa: Visit our website and chat with Efosa, our AI assistant, available 24/7
- Email Us: Simply reply to this email and we'll respond within 24 hours

WHAT HAPPENS NEXT?
1. Reply to this email with your scheduling preferences
2. We'll match you with an expert instructor within 2-3 business days
3. You'll receive your personalized class schedule and meeting links
4. Start your private Edo language journey!

YOUR CONTACT INFORMATION:
Email: ${data.email}
Phone: ${data.phone}

If any of this information is incorrect, please let us know in your reply.

Urhuese! 🙏
We're excited to guide you on your Edo language journey!

© 2026 Edo Language Academy. All rights reserved.
  `;

  return { subject, html, text };
}
