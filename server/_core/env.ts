export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // TEMPORARY: Hardcoded Stripe keys until environment variable issue is resolved
  // TODO: Remove hardcoding once Manus support fixes environment injection
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "sk_test_51RMpYEH2oBnqcEomgGTvkTtoxQCXPWwAlx3bIflzcRRg1pokm0LGVrsc0WBoTiTdZ3OAcJHr7fPVEmW8VPmiaLcR00cJaU5vQm",
  stripePublishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "pk_test_51RMpYEH2oBnqcEombmEtthj0nmO3H0UJI0zlXsUCOchvb5SqaOaNjgpW61gBvamPAAZ47kB8HHL6eVYQZQ2mWuWg00mDy7Scqn",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  stripePriceBeginner: process.env.STRIPE_PRICE_BEGINNER ?? "price_1STuz1H2oBnqcEomh4WSJRIl",
  stripePriceIntermediary: process.env.STRIPE_PRICE_INTERMEDIARY ?? "price_1STuzuH2oBnqcEomhyAwrSzO",
  stripePriceProficient: process.env.STRIPE_PRICE_PROFICIENT ?? "price_1STv0RH2oBnqcEomz8GFluWi",
  stripePriceBundle: process.env.STRIPE_PRICE_BUNDLE ?? "price_1STv14H2oBnqcEomPdWXNq6H",
  // SMTP Email Configuration
  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: parseInt(process.env.SMTP_PORT ?? "587", 10),
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPassword: process.env.SMTP_PASSWORD ?? "",
  smtpFromEmail: process.env.SMTP_FROM_EMAIL ?? "",
  smtpFromName: process.env.SMTP_FROM_NAME ?? "Edo Language Academy",
};
