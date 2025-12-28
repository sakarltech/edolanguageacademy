// import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
// import type { User } from "../../drizzle/schema";
// import { sdk } from "./sdk";

// export type TrpcContext = {
//   req: CreateExpressContextOptions["req"];
//   res: CreateExpressContextOptions["res"];
//   user: User | null;
// };

// export async function createContext(
//   opts: CreateExpressContextOptions
// ): Promise<TrpcContext> {
//   let user: User | null = null;

//   try {
//     user = await sdk.authenticateRequest(opts.req);
//   } catch (error) {
//     // Authentication is optional for public procedures.
//     user = null;
//   }

//   return {
//     req: opts.req,
//     res: opts.res,
//     user,
//   };
// }

import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import * as db from "../db";

export async function createContext({ req, res }: CreateExpressContextOptions) {
  if (!req.oidc?.user) {
    return { req, res, user: null };
  }

  const user = await db.getUserByOpenId(req.oidc.user.sub);

  return {
    req,
    res,
    user: user ?? null,
  };
}

export type TrpcContext = Awaited<ReturnType<typeof createContext>>;
