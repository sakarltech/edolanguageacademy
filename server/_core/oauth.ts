// import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
// import type { Express, Request, Response } from "express";
// import * as db from "../db";
// import { getSessionCookieOptions } from "./cookies";
// import { sdk } from "./sdk";

// function getQueryParam(req: Request, key: string): string | undefined {
//   const value = req.query[key];
//   return typeof value === "string" ? value : undefined;
// }

// export function registerOAuthRoutes(app: Express) {
//   app.get("/api/oauth/callback", async (req: Request, res: Response) => {
//     const code = getQueryParam(req, "code");
//     const state = getQueryParam(req, "state");

//     if (!code || !state) {
//       res.status(400).json({ error: "code and state are required" });
//       return;
//     }

//     try {
//       const tokenResponse = await sdk.exchangeCodeForToken(code, state);
//       const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

//       if (!userInfo.openId) {
//         res.status(400).json({ error: "openId missing from user info" });
//         return;
//       }

//       await db.upsertUser({
//         openId: userInfo.openId,
//         name: userInfo.name || null,
//         email: userInfo.email ?? null,
//         loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
//         lastSignedIn: new Date(),
//       });

//       const sessionToken = await sdk.createSessionToken(userInfo.openId, {
//         name: userInfo.name || "",
//         expiresInMs: ONE_YEAR_MS,
//       });

//       const cookieOptions = getSessionCookieOptions(req);
//       res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

//       // Redirect to dashboard after successful login/signup
//       res.redirect(302, "/dashboard");
//     } catch (error) {
//       console.error("[OAuth] Callback failed", error);
//       res.status(500).json({ error: "OAuth callback failed" });
//     }
//   });
// }

import { auth } from "express-openid-connect";
import type { Express, Request, Response } from "express";
import * as db from "../db";

export function registerOAuthRoutes(app: Express) {
  app.use(
    auth({
      authRequired: false,
      auth0Logout: true,
      secret: process.env.SESSION_SECRET!,
      baseURL: process.env.BASE_URL!,
      clientID: process.env.AUTH0_CLIENT_ID!,
      issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL!,
    })
  );

  // 🔑 Auth0 callback → DB sync
  app.get("/api/auth/callback", async (req: Request, res: Response) => {
    if (!req.oidc?.user) {
      return res.redirect("/login");
    }

    const { sub, email, name } = req.oidc.user;

    await db.upsertUser({
      openId: sub,
      email: email ?? null,
      name: name ?? null,
      lastSignedIn: new Date(),
    });

    res.redirect("/dashboard");
  });

  // Logout
  app.get("/api/auth/logout", (req, res) => {
    res.oidc.logout({ returnTo: process.env.BASE_URL });
  });
}
