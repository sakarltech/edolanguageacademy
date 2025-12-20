/**
 * Pre-designed email templates for marketing campaigns
 */

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  preheader: string;
  bodyHtml: string;
  bodyText: string;
  ctaText: string;
  ctaLink: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "holiday-2026",
    name: "Holiday Greetings & New Year Promotion 2026",
    description: "Festive template with Christmas/New Year greetings and 20% discount promotion",
    subject: "🎄 Season's Greetings from Edo Language Academy + Special New Year Gift!",
    preheader: "Òb'okhian! Celebrate the holidays with 20% OFF all courses. Use code OLWIQASA",
    bodyHtml: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Holiday Greetings</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFF8F0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header with festive background -->
          <tr>
            <td style="background: linear-gradient(135deg, #B91C1C 0%, #DC2626 50%, #B91C1C 100%); padding: 40px 30px; text-align: center; position: relative;">
              <div style="font-size: 48px; margin-bottom: 10px;">🎄✨🎁</div>
              <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 32px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
                Season's Greetings!
              </h1>
              <p style="color: #FEF3C7; margin: 0; font-size: 18px; font-style: italic;">
                Òb'okhian from Edo Language Academy
              </p>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #1F2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hello {{first_name}},
              </p>

              <p style="color: #1F2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                As we celebrate this wonderful season of joy and reflection, we want to extend our warmest wishes to you and your loved ones. May your holidays be filled with happiness, peace, and the rich blessings of our Edo heritage.
              </p>

              <p style="color: #1F2937; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                As we step into the New Year, there's no better time to embrace your roots and connect with the beautiful Edo language. Whether you're rekindling your connection to your heritage or discovering it for the first time, we're here to guide you every step of the way.
              </p>

              <!-- Special offer box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-radius: 12px; margin-bottom: 30px; border: 3px solid #D4AF37;">
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <div style="font-size: 36px; margin-bottom: 15px;">🎁</div>
                    <h2 style="color: #B91C1C; margin: 0 0 15px 0; font-size: 28px; font-weight: bold;">
                      New Year Special Gift
                    </h2>
                    <p style="color: #78350F; font-size: 20px; font-weight: bold; margin: 0 0 15px 0;">
                      Get 20% OFF All Courses!
                    </p>
                    <p style="color: #78350F; font-size: 16px; margin: 0 0 20px 0;">
                      Use discount code:
                    </p>
                    <div style="background-color: #B91C1C; color: #FEF3C7; padding: 15px 30px; border-radius: 8px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin-bottom: 15px;">
                      OLWIQASA
                    </div>
                    <p style="color: #78350F; font-size: 14px; margin: 0; font-style: italic;">
                      ⏰ Valid until January 31st, 2026
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Course highlights -->
              <h3 style="color: #B91C1C; font-size: 22px; margin: 0 0 20px 0; font-weight: bold;">
                Choose Your Learning Path:
              </h3>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 15px; background-color: #FFF8F0; border-left: 4px solid #D4AF37; margin-bottom: 10px;">
                    <p style="color: #B91C1C; font-weight: bold; margin: 0 0 5px 0; font-size: 16px;">🌱 Beginner Level</p>
                    <p style="color: #4B5563; font-size: 14px; margin: 0; line-height: 1.5;">Perfect for those starting their Edo language journey. Learn greetings, basic conversations, and cultural foundations.</p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #FFF8F0; border-left: 4px solid #D4AF37;">
                    <p style="color: #B91C1C; font-weight: bold; margin: 0 0 5px 0; font-size: 16px;">🌿 Intermediary Level</p>
                    <p style="color: #4B5563; font-size: 14px; margin: 0; line-height: 1.5;">Build on your foundation with deeper conversations, storytelling, and cultural practices.</p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #FFF8F0; border-left: 4px solid #D4AF37;">
                    <p style="color: #B91C1C; font-weight: bold; margin: 0 0 5px 0; font-size: 16px;">🌳 Proficient Level</p>
                    <p style="color: #4B5563; font-size: 14px; margin: 0; line-height: 1.5;">Master advanced fluency, proverbs, and become a confident speaker of Edo language.</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://www.edolanguageacademy.com/register" style="background: linear-gradient(135deg, #B91C1C 0%, #DC2626 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block; box-shadow: 0 4px 8px rgba(185, 28, 28, 0.3);">
                      🎓 Enroll Now & Save 20%
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #1F2937; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
                Join our vibrant community of learners and start 2026 by connecting with your heritage. Our live classes, expert instructors, and supportive community are ready to welcome you.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FFF8F0; padding: 30px; text-align: center; border-top: 2px solid #D4AF37;">
              <p style="color: #B91C1C; font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">
                Urhuese & Happy New Year! 🎊
              </p>
              <p style="color: #6B7280; font-size: 14px; margin: 0 0 20px 0;">
                From all of us at Edo Language Academy
              </p>
              <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                📧 Questions? Reply to this email or visit our website<br>
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
    `,
    bodyText: `
Season's Greetings from Edo Language Academy!

Òb'okhian! Hello {{first_name}},

As we celebrate this wonderful season of joy and reflection, we want to extend our warmest wishes to you and your loved ones. May your holidays be filled with happiness, peace, and the rich blessings of our Edo heritage.

As we step into the New Year, there's no better time to embrace your roots and connect with the beautiful Edo language. Whether you're rekindling your connection to your heritage or discovering it for the first time, we're here to guide you every step of the way.

🎁 NEW YEAR SPECIAL GIFT 🎁
Get 20% OFF All Courses!

Use discount code: OLWIQASA
Valid until January 31st, 2026

CHOOSE YOUR LEARNING PATH:

🌱 Beginner Level
Perfect for those starting their Edo language journey. Learn greetings, basic conversations, and cultural foundations.

🌿 Intermediary Level
Build on your foundation with deeper conversations, storytelling, and cultural practices.

🌳 Proficient Level
Master advanced fluency, proverbs, and become a confident speaker of Edo language.

Join our vibrant community of learners and start 2026 by connecting with your heritage. Our live classes, expert instructors, and supportive community are ready to welcome you.

👉 Enroll now at: https://www.edolanguageacademy.com/register

Urhuese & Happy New Year! 🎊
From all of us at Edo Language Academy

Questions? Reply to this email or visit www.edolanguageacademy.com
    `,
    ctaText: "Enroll Now & Save 20%",
    ctaLink: "https://www.edolanguageacademy.com/register",
  },
];
