import { env } from "~/env.mjs";
import { stripe } from "~/server/api/routers/payment";
import { db } from "~/server/db";
import Stripe from "stripe";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const sig = req.headers.get("stripe-signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      sig,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    let message = "Unknown Error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json(
      {
        message: `Webhook Error: ${message}`,
      },
      { status: 400 },
    );
  }
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        console.log(paymentIntentSucceeded);
        const feeId = paymentIntentSucceeded.metadata["feeId"];
        let receipt_url =
          (typeof paymentIntentSucceeded.latest_charge === "string" ||
          paymentIntentSucceeded.latest_charge instanceof String
            ? await stripe.charges.retrieve(
                `${paymentIntentSucceeded.latest_charge}`,
              )
            : paymentIntentSucceeded.latest_charge
          )?.receipt_url || null;

        if (!feeId)
          throw new Error(
            `Fatal error: no feeId associated with payment. Payment intent: ${paymentIntentSucceeded}`,
          );
        await db.fee.update({
          where: {
            id: feeId,
          },
          data: {
            paid: true,
            receiptURL: receipt_url,
          },
        });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Webhook handler failed" },
      { status: 500 },
    );
  }
  return NextResponse.json({ message: "Received" }, { status: 200 });
};

