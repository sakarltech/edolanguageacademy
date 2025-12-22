import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { chatbotRouter } from "./routers/chatbot";
import { enrollmentRouter } from "./routers/enrollment";
import { studentRouter } from "./routers/student";
import { adminRouter } from "./routers/admin";
import { forumRouter } from "./routers/forum";
import { notificationsRouter } from "./routers/notifications";
import { whatsappRouter } from "./routers/whatsapp";
import { certificatesRouter } from "./routers/certificates";
import { announcementRouter } from "./routers/announcement";
import { marketingRouter } from "./routers/marketing";
import { privateClassRouter } from "./routers/privateClass";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Chatbot router for AI-powered customer support
  chatbot: chatbotRouter,
  
  // Enrollment router for course registration and payments
  enrollment: enrollmentRouter,
  
  // Student router for dashboard and progress tracking
  student: studentRouter,
  
  // Admin router for managing academy
  admin: adminRouter,
  
  // Forum router for student discussions
  forum: forumRouter,
  
  // Notifications router for automated emails
  notifications: notificationsRouter,
  
  // WhatsApp router for managing group links
  whatsapp: whatsappRouter,
  
  // Certificates router for generating and managing certificates
  certificates: certificatesRouter,
  
  // Announcement router for scrolling homepage banner
  announcement: announcementRouter,
  
  // Marketing router for bulk email campaigns
  marketing: marketingRouter,
  
  // Private class router for one-on-one instruction
  privateClass: privateClassRouter,
});

export type AppRouter = typeof appRouter;
