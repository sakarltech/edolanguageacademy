export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // TEMPORARY: Hardcoded Stripe configuration to override old sandbox values
  // TODO: Remove hardcoding once Manus support fixes environment injection
  // Force use of user's Stripe account (51RMpYE) instead of old sandbox (51ST)
  stripeSecretKey: "sk_test_51RMpYEH2oBnqcEomgGTvkTtoxQCXPWwAlx3bIflzcRRg1pokm0LGVrsc0WBoTiTdZ3OAcJHr7fPVEmW8VPmiaLcR00cJaU5vQm",
  stripePublishableKey: "pk_test_51RMpYEH2oBnqcEombmEtthj0nmO3H0UJI0zlXsUCOchvb5SqaOaNjgpW61gBvamPAAZ47kB8HHL6eVYQZQ2mWuWg00mDy7Scqn",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  stripePriceBeginner: "price_1SUVmKH2oBnqcEomj9AcvYTa",
  stripePriceIntermediary: "price_1SUVn0H2oBnqcEommR2RA2h7",
  stripePriceProficient: "price_1SUVnqH2oBnqcEomOwdbDwIo",
  stripePriceBundle: "price_1SUVonH2oBnqcEom5Yf9cL45",
  // SMTP Email Configuration
  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: parseInt(process.env.SMTP_PORT ?? "587", 10),
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPassword: process.env.SMTP_PASSWORD ?? "",
  smtpFromEmail: process.env.SMTP_FROM_EMAIL ?? "",
  smtpFromName: process.env.SMTP_FROM_NAME ?? "Edo Language Academy",
};
