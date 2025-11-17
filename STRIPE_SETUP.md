# Stripe Integration Setup Guide

This document explains how to configure the Edo Language Academy website to use your own Stripe account for payment processing.

## Overview

The website uses Stripe for secure payment processing. All Stripe configuration is managed through environment variables, making it easy to switch between test and live modes or use different Stripe accounts.

## Required Environment Variables

### Stripe API Keys

These are your main Stripe credentials:

- **`STRIPE_SECRET_KEY`** - Your Stripe Secret Key (server-side)
  - Find this in: [Stripe Dashboard](https://dashboard.stripe.com/apikeys) → Developers → API keys
  - Format: `sk_test_...` (test mode) or `sk_live_...` (live mode)
  - ⚠️ **Keep this secret!** Never expose in client-side code

- **`VITE_STRIPE_PUBLISHABLE_KEY`** - Your Stripe Publishable Key (client-side)
  - Find this in: [Stripe Dashboard](https://dashboard.stripe.com/apikeys) → Developers → API keys
  - Format: `pk_test_...` (test mode) or `pk_live_...` (live mode)
  - Safe to expose in frontend code

- **`STRIPE_WEBHOOK_SECRET`** - Your Webhook Signing Secret
  - Find this in: [Stripe Dashboard](https://dashboard.stripe.com/webhooks) → Webhooks → Select your endpoint → Signing secret
  - Format: `whsec_...`
  - Used to verify webhook authenticity

### Stripe Price IDs

These are the Price IDs for each course level. You need to create products in your Stripe Dashboard first.

- **`STRIPE_PRICE_BEGINNER`** - Price ID for Beginner course (£19.99)
- **`STRIPE_PRICE_INTERMEDIARY`** - Price ID for Intermediary course (£24.99)
- **`STRIPE_PRICE_PROFICIENT`** - Price ID for Proficient course (£29.99)
- **`STRIPE_PRICE_BUNDLE`** - Price ID for Complete Bundle (£65.00)

## Step-by-Step Setup

### 1. Create Products in Stripe Dashboard

1. Go to [Stripe Products](https://dashboard.stripe.com/products)
2. Click **"+ Add product"** for each course level
3. Fill in the details:

#### Beginner Course
- **Name**: Edo Beginner Course
- **Description**: 8-week beginner level Edo language course with live classes, materials, and certificate
- **Pricing**: One-time payment
- **Price**: £19.99 GBP
- **Save** and copy the **Price ID** (starts with `price_...`)

#### Intermediary Course
- **Name**: Edo Intermediary Course
- **Description**: 8-week intermediary level Edo language course with live classes, materials, and certificate
- **Pricing**: One-time payment
- **Price**: £24.99 GBP
- **Save** and copy the **Price ID**

#### Proficient Course
- **Name**: Edo Proficient Course
- **Description**: 8-week proficient level Edo language course with live classes, materials, and certificate
- **Pricing**: One-time payment
- **Price**: £29.99 GBP
- **Save** and copy the **Price ID**

#### Complete Bundle
- **Name**: Complete Edo Language Bundle
- **Description**: All three levels (Beginner, Intermediary, Proficient) - Save £9.97!
- **Pricing**: One-time payment
- **Price**: £65.00 GBP
- **Save** and copy the **Price ID**

### 2. Set Up Webhook Endpoint

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"+ Add endpoint"**
3. Enter your endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_...`)

### 3. Configure Environment Variables

Add these environment variables to your deployment platform (Manus Management UI → Settings → Secrets):

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price IDs
STRIPE_PRICE_BEGINNER=price_your_beginner_price_id
STRIPE_PRICE_INTERMEDIARY=price_your_intermediary_price_id
STRIPE_PRICE_PROFICIENT=price_your_proficient_price_id
STRIPE_PRICE_BUNDLE=price_your_bundle_price_id
```

### 4. Test Mode vs Live Mode

**Test Mode** (for development and testing):
- Use test API keys (`sk_test_...` and `pk_test_...`)
- Use test Price IDs from test mode products
- Use test cards: `4242 4242 4242 4242` (Visa), expiry: any future date, CVC: any 3 digits

**Live Mode** (for production):
- Use live API keys (`sk_live_...` and `pk_live_...`)
- Use live Price IDs from live mode products
- Real cards will be charged

⚠️ **Important**: Make sure all keys and Price IDs are from the same mode (all test or all live).

## Default Values

If environment variables are not set, the system will fall back to these default Price IDs from the original Stripe account:

- Beginner: `price_1STuz1H2oBnqcEomh4WSJRIl`
- Intermediary: `price_1STuzuH2oBnqcEomhyAwrSzO`
- Proficient: `price_1STv0RH2oBnqcEomz8GFluWi`
- Bundle: `price_1STv14H2oBnqcEomPdWXNq6H`

**These are for reference only** and should be replaced with your own Price IDs.

## Verification

After configuration, test the enrollment flow:

1. Create a test account on your website
2. Log in and go to Dashboard
3. Click "Enrol Now" on a course
4. Complete the enrollment dialog
5. You should be redirected to Stripe Checkout
6. Use a test card to complete payment
7. Verify you're redirected back with success message
8. Check your Stripe Dashboard for the payment

## Troubleshooting

### "Invalid API Key" Error
- Verify your `STRIPE_SECRET_KEY` is correct
- Ensure you're using the right mode (test vs live)
- Check for extra spaces or quotes in the environment variable

### "No such price" Error
- Verify your Price IDs are correct
- Ensure Price IDs match the mode of your API keys (test Price IDs with test keys)
- Check that products are active in Stripe Dashboard

### Webhook Not Working
- Verify webhook endpoint URL is correct and accessible
- Check `STRIPE_WEBHOOK_SECRET` matches the webhook's signing secret
- Review webhook logs in Stripe Dashboard for error details

## Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)

For website integration issues:
- Check the application logs
- Review the enrollment router code in `server/routers/enrollment.ts`
- Contact the development team
