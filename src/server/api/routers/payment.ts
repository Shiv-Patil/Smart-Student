import { z } from "zod";
import Stripe from "stripe";
import { env } from "~/env.mjs";

export const stripe = new Stripe(`${env.STRIPE_SECRET_KEY}`, {
  apiVersion: "2023-10-16",
});

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const paymentRouter = createTRPCRouter({
  createCheckout: protectedProcedure
    .input(
      z.object({
        feeId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const feeDetails = await ctx.db.fee.findFirst({
        where: {
          id: input.feeId,
        },
      });
      if (!feeDetails)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Fee details not found in database",
        });
      const amountInPaise = feeDetails.amount * 100;
      return stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              unit_amount: Number(amountInPaise.toFixed(0)),
              product_data: {
                name: feeDetails.for,
              },
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          metadata: {
            feeId: input.feeId,
          },
        },
        success_url: `${ctx.headers.get(
          "origin",
        )}/finance/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ctx.headers.get("origin")}/finance/`,
      });
    }),

  getStripeCharge: protectedProcedure
    .input(z.object({ sessionId: z.string().min(1) }))
    .query(async ({ input }) => {
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);
      if (!session) return null;
      const intent =
        typeof session.payment_intent === "string" ||
        session.payment_intent instanceof String
          ? await stripe.paymentIntents.retrieve(`${session.payment_intent}`)
          : session.payment_intent;
      if (!intent) return null;
      return typeof intent.latest_charge === "string" ||
        intent.latest_charge instanceof String
        ? await stripe.charges.retrieve(`${intent.latest_charge}`)
        : intent.latest_charge;
    }),

  getAllFees: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.fee.findMany({
      where: {
        studentId: ctx.session.user.studentId,
      },
    });
  }),

  getReceipt: protectedProcedure
    .input(z.object({ feeId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return (
        await ctx.db.fee.findFirst({
          where: {
            id: input.feeId,
          },
        })
      )?.receiptURL;
    }),
});
