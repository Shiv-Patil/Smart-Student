import { profileRouter } from "~/server/api/routers/profile";
import { paymentRouter } from "./routers/payment";
import { createTRPCRouter } from "~/server/api/trpc";
import { academicsRouter } from "./routers/academics";
import { gradingRouter } from "./routers/grading";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  payment: paymentRouter,
  academics: academicsRouter,
  grading: gradingRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
