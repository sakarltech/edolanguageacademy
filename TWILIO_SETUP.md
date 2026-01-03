# Twilio SMS Setup for Phone Verification

This document explains how to configure Twilio for OTP (One-Time Password) SMS verification in the Edo Language Academy enrollment system.

## Overview

The phone verification system uses Twilio to send 6-digit OTP codes via SMS to verify phone numbers during enrollment. This ensures:
- Phone numbers are valid and belong to the user
- Reduces fraudulent registrations
- Enables reliable communication with students

## Prerequisites

1. A Twilio account (sign up at https://www.twilio.com/try-twilio)
2. A Twilio phone number capable of sending SMS

## Setup Steps

### 1. Create a Twilio Account

1. Go to https://www.twilio.com/try-twilio
2. Sign up for a free trial account (includes $15 credit)
3. Verify your email and phone number

### 2. Get a Twilio Phone Number

1. Log in to your Twilio Console (https://console.twilio.com/)
2. Navigate to **Phone Numbers** → **Manage** → **Buy a number**
3. Select a number with **SMS** capability
4. Purchase the number (free with trial credit)

### 3. Get Your Twilio Credentials

From your Twilio Console Dashboard (https://console.twilio.com/):

1. **Account SID**: Found on the dashboard home page
2. **Auth Token**: Click "Show" next to Auth Token on the dashboard
3. **Phone Number**: Your purchased Twilio phone number (format: +1234567890)

### 4. Add Credentials to Manus Secrets

**Important**: Do NOT add these credentials directly to the code or commit them to Git.

#### Option A: Using Manus Management UI (Recommended)

1. Open your project in Manus
2. Click the **Settings** icon in the Management UI (right panel)
3. Navigate to **Secrets** section
4. Click **Add Secret** and add each of the following:

```
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

#### Option B: Using Environment Variables (Local Development)

Create a `.env` file in the project root (already in .gitignore):

```bash
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### 5. Restart the Server

After adding the credentials, restart your development server:

```bash
pnpm dev
```

Or use the Manus Management UI to restart the server.

## Testing

### Trial Account Limitations

Twilio trial accounts have some limitations:
- Can only send SMS to **verified phone numbers**
- Messages include a trial account disclaimer
- Limited to $15 credit (~500 messages)

### Verifying Test Phone Numbers (Trial Only)

1. Go to https://console.twilio.com/us1/develop/phone-numbers/manage/verified
2. Click **Add a new number**
3. Enter the phone number you want to test with
4. Complete the verification process

### Upgrading to Production

To remove trial limitations:
1. Go to https://console.twilio.com/billing
2. Upgrade your account (requires payment method)
3. Benefits:
   - Send SMS to any phone number
   - No trial disclaimer in messages
   - Pay-as-you-go pricing (~$0.0075 per SMS)

## How It Works

### User Flow

1. User enters phone number in enrollment form
2. User clicks "Verify Phone Number"
3. System sends 6-digit OTP via SMS
4. User enters OTP code in verification dialog
5. System verifies code and marks phone as verified
6. WhatsApp number auto-populated with verified phone
7. User proceeds to payment

### Security Features

- **Rate limiting**: Max 1 OTP request per minute per user
- **Expiration**: OTP codes expire after 10 minutes
- **Attempt limiting**: Max 5 verification attempts per OTP
- **Country-specific validation**: Phone number length validated by country code
- **Verification required**: Payment blocked until phone is verified

## Supported Countries

The system includes validation for these countries:
- 🇳🇬 Nigeria (+234) - 10 digits
- 🇬🇧 United Kingdom (+44) - 10 digits
- 🇺🇸 United States/Canada (+1) - 10 digits
- 🇮🇳 India (+91) - 10 digits
- 🇿🇦 South Africa (+27) - 9 digits
- 🇰🇪 Kenya (+254) - 9 digits
- 🇬🇭 Ghana (+233) - 9 digits
- 🇨🇲 Cameroon (+237) - 9 digits
- 🇩🇪 Germany (+49) - 8-15 digits (default)
- 🇫🇷 France (+33) - 8-15 digits (default)

## Troubleshooting

### SMS Not Received

1. **Check Twilio Console Logs**:
   - Go to https://console.twilio.com/us1/monitor/logs/sms
   - Look for error messages

2. **Verify Phone Number (Trial Accounts)**:
   - Ensure the recipient number is verified in Twilio Console

3. **Check Phone Number Format**:
   - Must include country code
   - Remove spaces, dashes, parentheses

4. **Check Twilio Balance**:
   - Ensure you have sufficient credit

### "SMS service not configured" Error

This means Twilio credentials are not set. Check:
1. Credentials are added to Manus Secrets
2. Server has been restarted after adding credentials
3. Credentials are correct (no extra spaces)

### Invalid Phone Number Error

- Ensure phone number matches the expected length for the country code
- Remove any formatting (spaces, dashes, parentheses)

## Cost Estimation

### SMS Pricing (Pay-as-you-go)

- **Outbound SMS**: ~$0.0075 per message
- **100 enrollments/month**: ~$0.75/month
- **1000 enrollments/month**: ~$7.50/month

### Phone Number Cost

- **Monthly rental**: ~$1.15/month

## Alternative SMS Providers

If you prefer a different SMS provider, you can modify `server/_core/otp.ts` to use:
- **AWS SNS**: Good for AWS-hosted apps
- **MessageBird**: European alternative
- **Vonage (Nexmo)**: Global coverage
- **Africa's Talking**: Africa-focused provider

## Support

For Twilio-specific issues:
- Twilio Support: https://support.twilio.com
- Twilio Docs: https://www.twilio.com/docs/sms

For implementation issues:
- Check server logs for error messages
- Review `server/_core/otp.ts` for SMS sending logic
- Review `server/routers/otp.ts` for API endpoints
