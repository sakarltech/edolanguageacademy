# Email Integration Setup Guide (Namecheap SMTP)

This document explains how to configure the Edo Language Academy website to send automated emails using your Namecheap SMTP service.

## Overview

The website uses Nodemailer with SMTP to send automated emails for:
- **Enrollment confirmations** - Sent immediately after successful payment
- **Class reminders** - Can be configured for upcoming classes
- **Progress updates** - Can be configured for student milestones
- **Certificate notifications** - Can be configured when certificates are issued

## Namecheap SMTP Configuration

### Step 1: Get Your Namecheap SMTP Credentials

Your Namecheap SMTP settings should look like this:

- **SMTP Server (Host)**: `mail.privateemail.com` (or your custom domain's mail server)
- **SMTP Port**: 
  - `587` (recommended - STARTTLS)
  - `465` (SSL/TLS)
  - `25` (not recommended for security reasons)
- **Username**: Your full email address (e.g., `info@yourdomain.com`)
- **Password**: Your email account password
- **From Email**: Your email address (e.g., `info@yourdomain.com`)
- **From Name**: `Edo Language Academy` (or your preferred sender name)

### Step 2: Configure Environment Variables

Add these environment variables to your deployment platform (Manus Management UI → Settings → Secrets):

```env
# SMTP Email Configuration (Namecheap)
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_USER=info@yourdomain.com
SMTP_PASSWORD=your_email_password_here
SMTP_FROM_EMAIL=info@yourdomain.com
SMTP_FROM_NAME=Edo Language Academy
```

**Important Notes:**
- Replace `info@yourdomain.com` with your actual email address
- Replace `your_email_password_here` with your actual email password
- If using a custom domain, the SMTP host might be different (check Namecheap control panel)
- Use port `587` for STARTTLS (recommended) or `465` for SSL/TLS

### Step 3: Verify SMTP Settings in Namecheap

1. Log in to your [Namecheap Account](https://www.namecheap.com/myaccount/)
2. Go to **Private Email** (or **Email Hosting**)
3. Select your domain
4. Click on **Manage** next to your email account
5. Verify the following settings:
   - SMTP is enabled
   - Your email account is active
   - Password is correct

### Step 4: Test Email Configuration

After setting up the environment variables, you can test the email configuration:

1. The system will automatically send enrollment confirmation emails after successful payments
2. Check your email logs in the application console for any errors
3. Verify emails are being delivered to the recipient's inbox (check spam folder if needed)

## Common Namecheap SMTP Hosts

Depending on your Namecheap email service, use the appropriate SMTP host:

| Service Type | SMTP Host |
|--------------|-----------|
| Private Email | `mail.privateemail.com` |
| Professional Email | `mail.privateemail.com` |
| Custom Domain Email | `mail.yourdomain.com` (replace with your domain) |

## Email Templates

The system includes the following email templates:

### 1. Enrollment Confirmation Email
Automatically sent after successful payment. Includes:
- Welcome message in Edo language (Ọ̀bọ́khian!)
- Course details (level, duration, schedule)
- WhatsApp group link (if configured)
- Next steps for the student
- Contact information

### 2. Test Email
Used to verify SMTP configuration. Can be triggered manually for testing.

## Troubleshooting

### Email Not Sending

**Check SMTP Credentials:**
- Verify `SMTP_USER` is your full email address
- Verify `SMTP_PASSWORD` is correct
- Try logging into your email account via webmail to confirm credentials

**Check SMTP Host and Port:**
- Ensure `SMTP_HOST` is correct for your Namecheap service
- Try port `587` if `465` doesn't work (or vice versa)
- Some networks block port `25`, use `587` or `465` instead

**Check Firewall/Network:**
- Ensure your server can connect to Namecheap SMTP servers
- Some hosting providers block outgoing SMTP connections
- Contact your hosting provider if emails still don't send

### Emails Going to Spam

**Improve Email Deliverability:**
1. **Set up SPF record** in your domain's DNS:
   ```
   v=spf1 include:spf.privateemail.com ~all
   ```

2. **Set up DKIM** (available in Namecheap control panel):
   - Go to Private Email → Manage → Advanced DNS
   - Enable DKIM and add the provided DNS records

3. **Set up DMARC record** in your domain's DNS:
   ```
   v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
   ```

4. **Use a professional "From" address**:
   - Use `info@yourdomain.com` instead of `noreply@yourdomain.com`
   - Avoid free email providers (Gmail, Yahoo, etc.)

### Authentication Errors

**"Authentication failed" or "Invalid credentials":**
- Double-check your email password
- Try resetting your email password in Namecheap control panel
- Ensure you're using the full email address as username
- Check if 2FA is enabled (may require app-specific password)

**"Connection timeout":**
- Verify SMTP host is correct
- Try different port (587 or 465)
- Check if your server's firewall blocks SMTP connections

### Rate Limiting

Namecheap has sending limits to prevent spam:
- **Hourly limit**: Varies by plan (typically 50-100 emails/hour)
- **Daily limit**: Varies by plan (typically 500-1000 emails/day)

If you exceed these limits:
- Emails will be queued or rejected
- Contact Namecheap support to increase limits
- Consider upgrading to a higher-tier email plan

## Testing SMTP Configuration

### Manual Test via Code

You can add a test endpoint to verify email sending:

```typescript
// In server/routers.ts or a test file
import { sendTestEmail } from "../_core/email";

// Send test email
await sendTestEmail("your-test-email@example.com");
```

### Check Email Logs

Monitor application logs for email-related messages:
- `[Email] Sent successfully to...` - Email sent successfully
- `[Email] Failed to send:` - Email sending failed (check error details)
- `[Email] SMTP not configured...` - Environment variables not set

## Security Best Practices

1. **Never commit SMTP credentials to code**
   - Always use environment variables
   - Add `.env` to `.gitignore`

2. **Use strong email passwords**
   - At least 12 characters
   - Mix of uppercase, lowercase, numbers, symbols

3. **Enable 2FA on Namecheap account**
   - Protects your email account from unauthorized access
   - May require app-specific password for SMTP

4. **Regularly rotate passwords**
   - Change email password every 3-6 months
   - Update environment variables after password change

## Support

### Namecheap Support
- [Namecheap Support Center](https://www.namecheap.com/support/)
- [Private Email Documentation](https://www.namecheap.com/support/knowledgebase/subcategory/36/private-email/)
- Live Chat: Available 24/7

### Application Support
- Check application logs for detailed error messages
- Review `server/_core/email.ts` for email service implementation
- Contact development team for integration issues

## Additional Resources

- [Namecheap SMTP Settings Guide](https://www.namecheap.com/support/knowledgebase/article.aspx/1090/2175/how-to-configure-your-email-client-to-work-with-private-email/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Email Deliverability Best Practices](https://www.namecheap.com/support/knowledgebase/article.aspx/9793/2175/email-deliverability-best-practices/)
