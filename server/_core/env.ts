export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // Stripe configuration
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripePublishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  // Stripe price IDs
  stripePriceBeginner: process.env.STRIPE_PRICE_BEGINNER ?? "",
  stripePriceIntermediary: process.env.STRIPE_PRICE_INTERMEDIARY ?? "",
  stripePriceProficient: process.env.STRIPE_PRICE_PROFICIENT ?? "",
  stripePriceBundle: process.env.STRIPE_PRICE_BUNDLE ?? "",
  stripePricePrivate: process.env.STRIPE_PRICE_PRIVATE ?? "",
  // SMTP Email Configuration
  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: parseInt(process.env.SMTP_PORT ?? "587", 10),
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPassword: process.env.SMTP_PASSWORD ?? "",
  smtpFromEmail: process.env.SMTP_FROM_EMAIL ?? "",
  smtpFromName: process.env.SMTP_FROM_NAME ?? "Edo Language Academy",
  // Twilio SMS Configuration for OTP verification
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID ?? "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ?? "",
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER ?? "", // Format: +1234567890
};
