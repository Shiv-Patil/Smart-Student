import { permanentRedirect } from "next/navigation";
import PaymentSuccess from "~/components/(student)/PaymentSuccess";
import { api } from "~/trpc/server";

const Success = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const redirectTo = "/finance";
  const stripeSessionId = searchParams["session_id"];
  if (!stripeSessionId || !stripeSessionId.length)
    permanentRedirect(redirectTo);
  let invoice = null;
  try {
    const stripeSession = await api.payment.getStripeSession.query({
      sessionId:
        (Array.isArray(stripeSessionId)
          ? stripeSessionId[0]
          : stripeSessionId) || "",
    });
    if (
      !stripeSession ||
      stripeSession.status !== "complete" ||
      stripeSession.payment_status !== "paid"
    )
      permanentRedirect(redirectTo);
    invoice = stripeSession.invoice;
  } catch (err) {
    console.error(err);
    permanentRedirect(redirectTo);
  }

  return <PaymentSuccess invoice={invoice} />;
};

export default Success;

