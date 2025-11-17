/**
 * Email Service using Nodemailer
 * Configured for Namecheap SMTP or any standard SMTP provider
 */

import nodemailer from "nodemailer";
import { ENV } from "./env";

let transporter: nodemailer.Transporter | null = null;

/**
 * Get or create the email transporter
 */
function getTransporter() {
  if (!transporter && ENV.smtpHost && ENV.smtpUser && ENV.smtpPassword) {
    transporter = nodemailer.createTransport({
      host: ENV.smtpHost,
      port: ENV.smtpPort,
      secure: ENV.smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: ENV.smtpUser,
        pass: ENV.smtpPassword,
      },
    });
  }
  return transporter;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using the configured SMTP service
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const transport = getTransporter();
  
  if (!transport) {
    console.warn("[Email] SMTP not configured. Email not sent:", options.subject);
    return false;
  }

  try {
    await transport.sendMail({
      from: `"${ENV.smtpFromName}" <${ENV.smtpFromEmail}>`,
      to: options.to,
      subject: options.subject,
      text: options.text || options.html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
      html: options.html,
    });
    
    console.log(`[Email] Sent successfully to ${options.to}: ${options.subject}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return false;
  }
}

/**
 * Send enrollment confirmation email
 */
export async function sendEnrollmentConfirmationEmail(params: {
  to: string;
  learnerName: string;
  courseLevel: string;
  timeSlot: string;
  whatsappGroupLink?: string;
  whatsappGroupName?: string;
}) {
  const { to, learnerName, courseLevel, timeSlot, whatsappGroupLink, whatsappGroupName } = params;
  
  const courseName = `Edo ${courseLevel.charAt(0).toUpperCase() + courseLevel.slice(1)}`;
  const timeSlotDisplay = timeSlot === "11AM_GMT" ? "11:00 AM GMT (UK Time)" : "11:00 AM CST (US Central)";
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${courseName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #8B2500 0%, #C17817 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      background: #ffffff;
      padding: 30px 20px;
      border: 1px solid #e0e0e0;
      border-top: none;
    }
    .info-box {
      background: #FFF8E7;
      border-left: 4px solid #C17817;
      padding: 15px;
      margin: 20px 0;
    }
    .info-box strong {
      color: #8B2500;
    }
    .whatsapp-box {
      background: #E8F5E9;
      border-left: 4px solid #4CAF50;
      padding: 15px;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      background: #4CAF50;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 10px 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Ọ̀bọ́khian! 🎉</h1>
    <p style="margin: 10px 0 0 0; font-size: 18px;">Welcome to Edo Language Academy</p>
  </div>
  
  <div class="content">
    <p>Dear ${learnerName},</p>
    
    <p>Congratulations! Your enrollment in <strong>${courseName}</strong> has been confirmed. We're excited to have you join us on this journey to learn and preserve the beautiful Edo language.</p>
    
    <div class="info-box">
      <p><strong>Course:</strong> ${courseName}</p>
      <p><strong>Duration:</strong> 8 weeks (4 modules, 2 weeks per module)</p>
      <p><strong>Class Time:</strong> ${timeSlotDisplay}</p>
      <p><strong>Class Duration:</strong> 60 minutes per session</p>
      <p><strong>Frequency:</strong> Twice per week</p>
    </div>
    
    ${whatsappGroupLink ? `
    <div class="whatsapp-box">
      <p><strong>📱 Join Your Class WhatsApp Group</strong></p>
      <p>Stay connected with your classmates and instructor:</p>
      <p><strong>${whatsappGroupName || "Class Group"}</strong></p>
      <a href="${whatsappGroupLink}" class="button" style="background: #25D366;">Join WhatsApp Group</a>
    </div>
    ` : ''}
    
    <h3>What's Next?</h3>
    <ol>
      <li><strong>Access Your Dashboard:</strong> Log in to your student dashboard to view course materials, schedule, and progress tracking.</li>
      <li><strong>Prepare for Class:</strong> Review the Module 1 materials before your first class.</li>
      <li><strong>Mark Your Calendar:</strong> Add your class times to your calendar so you never miss a session.</li>
      ${whatsappGroupLink ? '<li><strong>Join WhatsApp Group:</strong> Click the button above to join your class group for updates and discussions.</li>' : ''}
    </ol>
    
    <h3>Need Help?</h3>
    <p>If you have any questions or need assistance, please don't hesitate to reach out to us:</p>
    <ul>
      <li>Email: support@edolanguageacademy.com</li>
      <li>Phone: +44 (0) 7456054968</li>
    </ul>
    
    <p style="margin-top: 30px;">We look forward to seeing you in class!</p>
    
    <p><strong>Ọ̀vbokhan!</strong> (Thank you!)<br>
    The Edo Language Academy Team</p>
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} Edo Language Academy. All rights reserved.</p>
    <p style="font-size: 12px; color: #999;">
      This email was sent to ${to} because you enrolled in a course at Edo Language Academy.
    </p>
  </div>
</body>
</html>
  `;
  
  return sendEmail({
    to,
    subject: `Welcome to ${courseName} - Enrollment Confirmed! 🎉`,
    html,
  });
}

/**
 * Test email configuration by sending a test email
 */
export async function sendTestEmail(to: string): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Test Email</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
  <h2>Email Configuration Test</h2>
  <p>This is a test email from Edo Language Academy.</p>
  <p>If you received this email, your SMTP configuration is working correctly!</p>
  <p><strong>Configuration Details:</strong></p>
  <ul>
    <li>SMTP Host: ${ENV.smtpHost}</li>
    <li>SMTP Port: ${ENV.smtpPort}</li>
    <li>From: ${ENV.smtpFromEmail}</li>
  </ul>
  <p>Timestamp: ${new Date().toISOString()}</p>
</body>
</html>
  `;
  
  return sendEmail({
    to,
    subject: "Test Email - Edo Language Academy",
    html,
  });
}
