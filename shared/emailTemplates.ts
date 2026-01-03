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
    id: "end-of-year-2025",
    name: "End of Year Super Sale - 40% OFF (Auto-Applied)",
    description: "End of Year promotion with automatic 40% discount - no code needed!",
    subject: "🎊 FINAL HOURS: 40% OFF Auto-Applied - End of Year Sale!",
    preheader: "Òb'okhian! Your 40% End of Year discount is automatically applied at checkout. Only 3 days left!",
    bodyHtml: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boxing Day Sale</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFF8F0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header with Boxing Day theme -->
          <tr>
            <td style="background: linear-gradient(135deg, #15803D 0%, #B91C1C 50%, #15803D 100%); padding: 40px 30px; text-align: center; position: relative;">
              <div style="font-size: 48px; margin-bottom: 10px;">🎁✨🎉</div>
              <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 36px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
                End of Year MEGA SALE!
              </h1>
              <p style="color: #FEF3C7; margin: 0; font-size: 20px; font-weight: bold;">
                Stack Your Savings for 40% OFF
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
                We hope you had a wonderful Christmas! As we close out the year, we're bringing you an <strong>incredible opportunity</strong> to save 40% on your Edo language learning journey.
              </p>

              <p style="color: #1F2937; font-size: 18px; line-height: 1.6; margin: 0 0 30px 0; font-weight: bold; text-align: center;">
                🎊 <span style="color: #15803D; font-size: 24px;">40% OFF Automatically Applied</span> to ALL courses! No code needed - your discount is already active at checkout! 🎊
              </p>

              <!-- Countdown urgency box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #FEE2E2 0%, #FEF3C7 100%); border-radius: 12px; margin-bottom: 30px; border: 3px solid #B91C1C;">
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <div style="font-size: 36px; margin-bottom: 15px;">⏰⏰⏰</div>
                    <h2 style="color: #B91C1C; margin: 0 0 20px 0; font-size: 28px; font-weight: bold;">
                      ⚡ ONLY 3 DAYS LEFT! ⚡
                    </h2>
                    
                    <!-- Automatic discount notice -->
                    <div style="margin-bottom: 20px; background-color: #D1FAE5; padding: 20px; border-radius: 8px; border: 2px solid #15803D;">
                      <p style="color: #15803D; font-size: 24px; margin: 0 0 10px 0; font-weight: bold;">
                        ✅ 40% OFF Automatically Applied!
                      </p>
                      <p style="color: #78350F; font-size: 14px; margin: 0;">
                        No code needed - your End of Year discount is already active!
                      </p>
                    </div>

                    <div style="border-top: 2px dashed #B91C1C; margin: 20px 0; padding-top: 20px;">
                      <p style="color: #B91C1C; font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">
                        ⏰ Offer Expires: December 31, 2025 at 11:59 PM
                      </p>
                      <p style="color: #78350F; font-size: 16px; margin: 0;">
                        After this, discount drops to 20% OFF
                      </p>
                    </div>

                    <p style="color: #B91C1C; font-size: 14px; margin: 15px 0 0 0; font-weight: bold;">
                      ⏰ Hurry! Boxing Day code expires December 31st, 2025
                    </p>
                  </td>
                </tr>
              </table>

              <!-- How to use -->
              <div style="background-color: #FFF8F0; padding: 20px; border-radius: 8px; border-left: 4px solid #D4AF37; margin-bottom: 30px;">
                <h3 style="color: #B91C1C; font-size: 18px; margin: 0 0 15px 0; font-weight: bold;">
                  📝 It's Super Simple:
                </h3>
                <ol style="color: #4B5563; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Choose your course level (Beginner, Intermediary, Proficient, or Bundle)</li>
                  <li>Click "Enroll Now" and proceed to checkout</li>
                  <li>Your <strong>40% discount is automatically applied</strong> - no code needed!</li>
                  <li>Complete your payment and start learning immediately 🎉</li>
                </ol>
              </div>

              <!-- Course highlights -->
              <h3 style="color: #B91C1C; font-size: 22px; margin: 0 0 20px 0; font-weight: bold;">
                Choose Your Learning Path:
              </h3>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 15px; background-color: #FFF8F0; border-left: 4px solid #15803D; margin-bottom: 10px;">
                    <p style="color: #15803D; font-weight: bold; margin: 0 0 5px 0; font-size: 16px;">🌱 Beginner Level</p>
                    <p style="color: #4B5563; font-size: 14px; margin: 0; line-height: 1.5;">Perfect for those starting their Edo language journey. Learn greetings, basic conversations, and cultural foundations.</p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #FFF8F0; border-left: 4px solid #15803D;">
                    <p style="color: #15803D; font-weight: bold; margin: 0 0 5px 0; font-size: 16px;">🌿 Intermediary Level</p>
                    <p style="color: #4B5563; font-size: 14px; margin: 0; line-height: 1.5;">Build on your foundation with deeper conversations, storytelling, and cultural practices.</p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #FFF8F0; border-left: 4px solid #15803D;">
                    <p style="color: #15803D; font-weight: bold; margin: 0 0 5px 0; font-size: 16px;">🌳 Proficient Level</p>
                    <p style="color: #4B5563; font-size: 14px; margin: 0; line-height: 1.5;">Master advanced fluency, proverbs, and become a confident speaker of Edo language.</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="https://www.edolanguageacademy.com/register" style="background: linear-gradient(135deg, #15803D 0%, #B91C1C 100%); color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 8px; font-size: 20px; font-weight: bold; display: inline-block; box-shadow: 0 4px 8px rgba(185, 28, 28, 0.3);">
                      🎓 Claim Your 40% OFF Now!
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #1F2937; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
                Don't miss this incredible opportunity to save big while investing in your heritage. Our live classes, expert instructors, and supportive community are ready to welcome you!
              </p>

              <p style="color: #B91C1C; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0; font-weight: bold; text-align: center;">
                ⚠️ Remember: End of Year Sale ends December 31st at 11:59 PM - Don't wait!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FFF8F0; padding: 30px; text-align: center; border-top: 2px solid #D4AF37;">
              <p style="color: #15803D; font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">
                Urhuese & Happy New Year! 🎊
              </p>
              <p style="color: #6B7280; font-size: 14px; margin: 0 0 20px 0;">
                From all of us at Edo Language Academy
              </p>
              <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                📧 Questions? Reply to this email or visit our website<br>
                🌐 <a href="https://www.edolanguageacademy.com" style="color: #15803D; text-decoration: none;">www.edolanguageacademy.com</a>
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
FINAL HOURS: 40% OFF Auto-Applied - End of Year Sale!

Òb'okhian! Hello {{first_name}},

We hope you had a wonderful Christmas! As we close out the year, we're bringing you an incredible opportunity to save 40% on your Edo language learning journey.

🎊 40% OFF AUTOMATICALLY APPLIED! 🎊

No code needed - your End of Year discount is automatically applied at checkout!

⏰ ONLY 3 DAYS LEFT!
⏰ Offer Expires: December 31, 2025 at 11:59 PM
After this, discount drops to 20% OFF

IT'S SUPER SIMPLE:
1. Choose your course level (Beginner, Intermediary, Proficient, or Bundle)
2. Click "Enroll Now" and proceed to checkout
3. Your 40% discount is automatically applied - no code needed!
4. Complete your payment and start learning immediately 🎉

CHOOSE YOUR LEARNING PATH:

🌱 Beginner Level
Perfect for those starting their Edo language journey. Learn greetings, basic conversations, and cultural foundations.

🌿 Intermediary Level
Build on your foundation with deeper conversations, storytelling, and cultural practices.

🌳 Proficient Level
Master advanced fluency, proverbs, and become a confident speaker of Edo language.

📦 Complete Bundle
All three levels at the best value - save even more with 40% OFF!

Don't miss this incredible opportunity to save big while investing in your heritage. Our live classes, expert instructors, and supportive community are ready to welcome you!

👉 Enroll now at: https://www.edolanguageacademy.com/register

⚠️ Remember: End of Year Sale ends December 31st at 11:59 PM - Don't wait!

Urhuese & Happy New Year! 🎊
From all of us at Edo Language Academy

Questions? Reply to this email or visit www.edolanguageacademy.com
    `,
    ctaText: "Claim Your 40% OFF Now!",
    ctaLink: "https://www.edolanguageacademy.com/register",
  },
  {
    id: "last-24-hours-2025",
    name: "LAST 24 HOURS - Final Chance 40% OFF",
    description: "Extreme urgency email for final day of End of Year sale (send Dec 30th)",
    subject: "⏰ LAST CHANCE: 40% OFF Ends Tomorrow at Midnight!",
    preheader: "Òb'okhian! This is your final warning - 40% discount expires in 24 hours. Don't miss out!",
    bodyHtml: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Last 24 Hours</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFF8F0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Urgent Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #B91C1C 0%, #DC2626 50%, #B91C1C 100%); padding: 40px 30px; text-align: center; position: relative;">
              <div style="font-size: 48px; margin-bottom: 10px;">⏰🚨⚠️</div>
              <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 42px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                LAST 24 HOURS!
              </h1>
              <p style="color: #FEF3C7; margin: 0; font-size: 22px; font-weight: bold; text-transform: uppercase;">
                Final Chance for 40% OFF
              </p>
              <p style="color: #ffffff; margin: 15px 0 0 0; font-size: 16px;">
                Expires: December 31, 2025 at 11:59 PM
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #1F2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Òb'okhian {{first_name}},
              </p>

              <p style="color: #1F2937; font-size: 18px; line-height: 1.6; margin: 0 0 30px 0; font-weight: bold;">
                This is it. Your <span style="color: #B91C1C; font-size: 24px;">final chance</span> to save 40% on your Edo language learning journey.
              </p>

              <!-- Urgency Box -->
              <div style="background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%); border: 3px solid #B91C1C; border-radius: 12px; padding: 30px; margin: 0 0 30px 0; text-align: center;">
                <p style="color: #B91C1C; font-size: 32px; font-weight: bold; margin: 0 0 15px 0;">
                  ⏰ ONLY 24 HOURS LEFT ⏰
                </p>
                <p style="color: #7F1D1D; font-size: 18px; margin: 0 0 20px 0;">
                  After midnight tomorrow, the discount drops to 20%
                </p>
                <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin: 0 0 20px 0;">
                  <p style="color: #15803D; font-size: 36px; font-weight: bold; margin: 0;">
                    40% OFF
                  </p>
                  <p style="color: #78350F; font-size: 16px; margin: 10px 0 0 0;">
                    Automatically Applied at Checkout
                  </p>
                </div>
                <p style="color: #B91C1C; font-size: 14px; font-weight: bold; margin: 0;">
                  No code needed - discount expires in 24 hours!
                </p>
              </div>

              <!-- Why Act Now -->
              <div style="background-color: #FFF8F0; border-left: 4px solid #D4AF37; padding: 20px; margin: 0 0 30px 0;">
                <p style="color: #1F2937; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">
                  Why You Can't Wait:
                </p>
                <ul style="color: #1F2937; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>This is the <strong>biggest discount</strong> we've ever offered</li>
                  <li>After tonight, it's gone forever - no extensions</li>
                  <li>Start 2025 with a new skill and cultural connection</li>
                  <li>Limited spots in upcoming live classes</li>
                </ul>
              </div>

              <!-- Course Options -->
              <p style="color: #1F2937; font-size: 18px; font-weight: bold; margin: 0 0 20px 0; text-align: center;">
                Choose Your Course - 40% OFF Applied Automatically:
              </p>

              <div style="margin: 0 0 30px 0;">
                <div style="background-color: #F0FDF4; border-radius: 8px; padding: 15px; margin: 0 0 15px 0; border: 2px solid #15803D;">
                  <p style="color: #15803D; font-size: 18px; font-weight: bold; margin: 0 0 5px 0;">🌱 Beginner Level</p>
                  <p style="color: #1F2937; font-size: 14px; margin: 0;">Start your journey - learn greetings, basics, and cultural foundations</p>
                </div>

                <div style="background-color: #F0FDF4; border-radius: 8px; padding: 15px; margin: 0 0 15px 0; border: 2px solid #15803D;">
                  <p style="color: #15803D; font-size: 18px; font-weight: bold; margin: 0 0 5px 0;">🌿 Intermediary Level</p>
                  <p style="color: #1F2937; font-size: 14px; margin: 0;">Build fluency - deeper conversations and cultural practices</p>
                </div>

                <div style="background-color: #F0FDF4; border-radius: 8px; padding: 15px; margin: 0 0 15px 0; border: 2px solid #15803D;">
                  <p style="color: #15803D; font-size: 18px; font-weight: bold; margin: 0 0 5px 0;">🌳 Proficient Level</p>
                  <p style="color: #1F2937; font-size: 14px; margin: 0;">Master the language - advanced fluency and confident speaking</p>
                </div>

                <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-radius: 8px; padding: 15px; border: 3px solid #D4AF37;">
                  <p style="color: #78350F; font-size: 18px; font-weight: bold; margin: 0 0 5px 0;">📦 Complete Bundle - BEST VALUE!</p>
                  <p style="color: #1F2937; font-size: 14px; margin: 0;">All three levels at maximum savings with 40% OFF!</p>
                </div>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://www.edolanguageacademy.com/register" style="display: inline-block; background: linear-gradient(135deg, #B91C1C 0%, #DC2626 100%); color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 50px; font-size: 20px; font-weight: bold; box-shadow: 0 4px 6px rgba(185, 28, 28, 0.3); text-transform: uppercase;">
                  ⚡ CLAIM 40% OFF NOW - LAST CHANCE! ⚡
                </a>
              </div>

              <!-- Final Warning -->
              <div style="background-color: #FEE2E2; border: 2px dashed #B91C1C; border-radius: 8px; padding: 20px; text-align: center;">
                <p style="color: #B91C1C; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">
                  ⚠️ FINAL WARNING ⚠️
                </p>
                <p style="color: #7F1D1D; font-size: 14px; margin: 0;">
                  This email is your last reminder. After midnight on December 31st, the 40% discount is GONE and will drop to 20%. Don't let this opportunity slip away!
                </p>
              </div>

              <p style="color: #1F2937; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
                We don't want you to miss this. Our live classes, expert instructors, and supportive community are ready to welcome you. But you must act NOW.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FFF8F0; padding: 30px; text-align: center; border-top: 2px solid #D4AF37;">
              <p style="color: #15803D; font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">
                Urhuese! See you in class! 🎊
              </p>
              <p style="color: #6B7280; font-size: 14px; margin: 0 0 20px 0;">
                From all of us at Edo Language Academy
              </p>
              <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                Questions? Reply to this email or visit www.edolanguageacademy.com
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
LAST 24 HOURS: 40% OFF Ends Tomorrow at Midnight!

Òb'okhian {{first_name}},

This is it. Your FINAL CHANCE to save 40% on your Edo language learning journey.

⏰ ONLY 24 HOURS LEFT ⏰

After midnight tomorrow (December 31st at 11:59 PM), the discount drops to 20%.

40% OFF AUTOMATICALLY APPLIED!
No code needed - just enroll and your discount is active at checkout!

WHY YOU CAN'T WAIT:
- This is the BIGGEST discount we've ever offered
- After tonight, it's gone forever - no extensions
- Start 2025 with a new skill and cultural connection
- Limited spots in upcoming live classes

CHOOSE YOUR COURSE - 40% OFF APPLIED AUTOMATICALLY:

🌱 Beginner Level
Start your journey - learn greetings, basics, and cultural foundations

🌿 Intermediary Level
Build fluency - deeper conversations and cultural practices

🌳 Proficient Level
Master the language - advanced fluency and confident speaking

📦 Complete Bundle - BEST VALUE!
All three levels at maximum savings with 40% OFF!

👉 Enroll now at: https://www.edolanguageacademy.com/register

⚠️ FINAL WARNING ⚠️
This email is your last reminder. After midnight on December 31st, the 40% discount is GONE and will drop to 20%. Don't let this opportunity slip away!

We don't want you to miss this. Our live classes, expert instructors, and supportive community are ready to welcome you. But you must act NOW.

Urhuese! See you in class! 🎊
From all of us at Edo Language Academy

Questions? Reply to this email or visit www.edolanguageacademy.com
    `,
    ctaText: "⚡ CLAIM 40% OFF NOW - LAST CHANCE! ⚡",
    ctaLink: "https://www.edolanguageacademy.com/register",
  },
  {
    id: "new-year-2026",
    name: "New Year, New Skills - 20% OFF + Grace Period",
    description: "New Year email with 20% discount and 1-week grace period for missed 40% discount",
    subject: "🎆 Happy New Year! Start 2026 with Edo Language + Special Grace Period",
    preheader: "Òb'okhian! Missed the 40% deal? We've got you covered for 1 more week. Plus ongoing 20% OFF!",
    bodyHtml: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Year, New Skills</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFF8F0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- New Year Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #15803D 0%, #16A34A 50%, #15803D 100%); padding: 40px 30px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 15px;">🎆🎉✨</div>
              <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 42px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                Happy New Year 2026!
              </h1>
              <p style="color: #FEF3C7; margin: 0; font-size: 22px; font-weight: bold;">
                New Year, New Skills, New You
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #1F2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Òb'okhian {{first_name}},
              </p>

              <p style="color: #1F2937; font-size: 18px; line-height: 1.6; margin: 0 0 30px 0;">
                Welcome to 2026! As we step into this new year, there's no better time to connect with your roots, learn Edo language, and embrace your cultural heritage.
              </p>

              <!-- Grace Period Box -->
              <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border: 3px solid #D4AF37; border-radius: 12px; padding: 30px; margin: 0 0 30px 0; text-align: center;">
                <p style="color: #78350F; font-size: 28px; font-weight: bold; margin: 0 0 15px 0;">
                  🎁 Missed the 40% Deal? We've Got You! 🎁
                </p>
                <p style="color: #1F2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Life gets busy, and we understand you might have missed our End of Year sale. <strong>We don't want you to miss out!</strong>
                </p>
                <div style="background-color: #ffffff; border-radius: 8px; padding: 25px; margin: 0 0 20px 0; border: 2px dashed #D4AF37;">
                  <p style="color: #B91C1C; font-size: 32px; font-weight: bold; margin: 0 0 10px 0;">
                    40% OFF Grace Period
                  </p>
                  <p style="color: #15803D; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">
                    Valid for 1 Week Only (Until January 7, 2026)
                  </p>
                  <p style="color: #1F2937; font-size: 14px; line-height: 1.6; margin: 0;">
                    If you truly wanted to enroll during our 40% sale but missed it, <strong>contact us directly</strong> and we'll honor the discount for you!
                  </p>
                </div>
                <div style="background-color: #F0FDF4; border-radius: 8px; padding: 20px; text-align: left;">
                  <p style="color: #15803D; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">
                    How to Claim Your 40% Grace Period Discount:
                  </p>
                  <ul style="color: #1F2937; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Email us:</strong> info@edolanguageacademy.com</li>
                    <li><strong>WhatsApp:</strong> [Your WhatsApp Number]</li>
                    <li>Mention "40% Grace Period" in your message</li>
                    <li>We'll send you a special enrollment link</li>
                  </ul>
                </div>
                <p style="color: #B91C1C; font-size: 14px; font-weight: bold; margin: 15px 0 0 0;">
                  ⚠️ This grace period expires January 7, 2026 - no exceptions after that!
                </p>
              </div>

              <!-- Ongoing 20% Discount -->
              <div style="background-color: #F0FDF4; border: 2px solid #15803D; border-radius: 12px; padding: 30px; margin: 0 0 30px 0; text-align: center;">
                <p style="color: #15803D; font-size: 24px; font-weight: bold; margin: 0 0 15px 0;">
                  🎉 Ongoing New Year Discount: 20% OFF
                </p>
                <p style="color: #1F2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Not eligible for the grace period? No problem! Everyone can still enjoy <strong>20% OFF all courses</strong> throughout January.
                </p>
                <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin: 0 0 15px 0;">
                  <p style="color: #78350F; font-size: 24px; font-weight: bold; margin: 0 0 10px 0;">
                    Use Code: OLWIQASA
                  </p>
                  <p style="color: #6B7280; font-size: 14px; margin: 0;">
                    Valid until January 31, 2026
                  </p>
                </div>
                <a href="https://www.edolanguageacademy.com/register" style="display: inline-block; background: linear-gradient(135deg, #15803D 0%, #16A34A 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(21, 128, 61, 0.3);">
                  Enroll Now with 20% OFF
                </a>
              </div>

              <!-- Why Start Now -->
              <div style="background-color: #FFF8F0; border-left: 4px solid #D4AF37; padding: 20px; margin: 0 0 30px 0;">
                <p style="color: #1F2937; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">
                  Why 2026 is YOUR Year to Learn Edo:
                </p>
                <ul style="color: #1F2937; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Connect deeper with your family and heritage</li>
                  <li>Preserve a beautiful language for future generations</li>
                  <li>Join a supportive community of learners</li>
                  <li>Live classes with expert instructors</li>
                  <li>Flexible learning at your own pace</li>
                </ul>
              </div>

              <!-- Course Options -->
              <p style="color: #1F2937; font-size: 18px; font-weight: bold; margin: 0 0 20px 0; text-align: center;">
                Choose Your Learning Path:
              </p>

              <div style="margin: 0 0 30px 0;">
                <div style="background-color: #F0FDF4; border-radius: 8px; padding: 15px; margin: 0 0 15px 0; border: 2px solid #15803D;">
                  <p style="color: #15803D; font-size: 18px; font-weight: bold; margin: 0 0 5px 0;">🌱 Beginner Level</p>
                  <p style="color: #1F2937; font-size: 14px; margin: 0;">Perfect for starting your journey - greetings, basics, and cultural foundations</p>
                </div>

                <div style="background-color: #F0FDF4; border-radius: 8px; padding: 15px; margin: 0 0 15px 0; border: 2px solid #15803D;">
                  <p style="color: #15803D; font-size: 18px; font-weight: bold; margin: 0 0 5px 0;">🌿 Intermediary Level</p>
                  <p style="color: #1F2937; font-size: 14px; margin: 0;">Build your fluency with deeper conversations and cultural practices</p>
                </div>

                <div style="background-color: #F0FDF4; border-radius: 8px; padding: 15px; margin: 0 0 15px 0; border: 2px solid #15803D;">
                  <p style="color: #15803D; font-size: 18px; font-weight: bold; margin: 0 0 5px 0;">🌳 Proficient Level</p>
                  <p style="color: #1F2937; font-size: 14px; margin: 0;">Master the language with advanced fluency and confident speaking</p>
                </div>

                <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-radius: 8px; padding: 15px; border: 3px solid #D4AF37;">
                  <p style="color: #78350F; font-size: 18px; font-weight: bold; margin: 0 0 5px 0;">📦 Complete Bundle - BEST VALUE!</p>
                  <p style="color: #1F2937; font-size: 14px; margin: 0;">All three levels at maximum savings - your complete journey to fluency</p>
                </div>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.edolanguageacademy.com/register" style="display: inline-block; background: linear-gradient(135deg, #15803D 0%, #16A34A 100%); color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 50px; font-size: 20px; font-weight: bold; box-shadow: 0 4px 6px rgba(21, 128, 61, 0.3); text-transform: uppercase;">
                  Start Your Journey Today
                </a>
              </div>

              <p style="color: #1F2937; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                Make 2026 the year you connect with your heritage. Our community is waiting to welcome you!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FFF8F0; padding: 30px; text-align: center; border-top: 2px solid #D4AF37;">
              <p style="color: #15803D; font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">
                Urhuese! See you in class! 🎆
              </p>
              <p style="color: #6B7280; font-size: 14px; margin: 0 0 20px 0;">
                From all of us at Edo Language Academy
              </p>
              <p style="color: #9CA3AF; font-size: 12px; margin: 0 0 10px 0;">
                Questions? Email: info@edolanguageacademy.com | WhatsApp: [Your Number]
              </p>
              <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                Visit: www.edolanguageacademy.com
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
Happy New Year 2026! New Year, New Skills, New You

Òb'okhian {{first_name}},

Welcome to 2026! As we step into this new year, there's no better time to connect with your roots, learn Edo language, and embrace your cultural heritage.

🎁 MISSED THE 40% DEAL? WE'VE GOT YOU! 🎁

Life gets busy, and we understand you might have missed our End of Year sale. We don't want you to miss out!

40% OFF GRACE PERIOD
Valid for 1 Week Only (Until January 7, 2026)

If you truly wanted to enroll during our 40% sale but missed it, contact us directly and we'll honor the discount for you!

HOW TO CLAIM YOUR 40% GRACE PERIOD DISCOUNT:
- Email us: info@edolanguageacademy.com
- WhatsApp: [Your WhatsApp Number]
- Mention "40% Grace Period" in your message
- We'll send you a special enrollment link

⚠️ This grace period expires January 7, 2026 - no exceptions after that!

---

🎉 ONGOING NEW YEAR DISCOUNT: 20% OFF

Not eligible for the grace period? No problem! Everyone can still enjoy 20% OFF all courses throughout January.

Use Code: OLWIQASA
Valid until January 31, 2026

👉 Enroll now: https://www.edolanguageacademy.com/register

---

WHY 2026 IS YOUR YEAR TO LEARN EDO:
- Connect deeper with your family and heritage
- Preserve a beautiful language for future generations
- Join a supportive community of learners
- Live classes with expert instructors
- Flexible learning at your own pace

CHOOSE YOUR LEARNING PATH:

🌱 Beginner Level
Perfect for starting your journey - greetings, basics, and cultural foundations

🌿 Intermediary Level
Build your fluency with deeper conversations and cultural practices

🌳 Proficient Level
Master the language with advanced fluency and confident speaking

📦 Complete Bundle - BEST VALUE!
All three levels at maximum savings - your complete journey to fluency

👉 Start your journey: https://www.edolanguageacademy.com/register

Make 2026 the year you connect with your heritage. Our community is waiting to welcome you!

Urhuese! See you in class! 🎆
From all of us at Edo Language Academy

Questions? Email: info@edolanguageacademy.com | WhatsApp: [Your Number]
Visit: www.edolanguageacademy.com
    `,
    ctaText: "Start Your Journey Today",
    ctaLink: "https://www.edolanguageacademy.com/register",
  },
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
