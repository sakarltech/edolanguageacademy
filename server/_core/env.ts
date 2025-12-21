export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // LIVE MODE Stripe configuration for production
  // Using live API keys and webhook secret for www.edolanguageacademy.com
  stripeSecretKey: "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",
  stripePublishableKey: "pk_live_51RMpYEH2oBnqcEom0vyUVImAHukimeVRc3aF62hlYLqA6tKaTjCtDaRzPJcnnt0lDgYIpFQT9TEHiz24K0xoD7SB00VragvuoE",
  stripeWebhookSecret: "whsec_dsI6krK1ohnpkMhWFVjU2ayk7VsMcPWm", // Live mode webhook secret for custom domain
  // Live mode price IDs for production courses
  stripePriceBeginner: "price_1RmcT8H2oBnqcEomY7HNW8jJ",
  stripePriceIntermediary: "price_1RmcXiH2oBnqcEomeTVJu1JD",
  stripePriceProficient: "price_1RmcbUH2oBnqcEomNA9DUsE8",
  stripePriceBundle: "price_1Sa3rbH2oBnqcEomXYVOLFQQ",
  stripePricePrivate: "price_1SMqMvH2oBnqcEomDuLxNs6v", // £49.99 for private classes
  // SMTP Email Configuration
  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: parseInt(process.env.SMTP_PORT ?? "587", 10),
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPassword: process.env.SMTP_PASSWORD ?? "",
  smtpFromEmail: process.env.SMTP_FROM_EMAIL ?? "",
  smtpFromName: process.env.SMTP_FROM_NAME ?? "Edo Language Academy",
};
