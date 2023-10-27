import { redirect } from "next/navigation";
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
    redirect(redirectTo);
  let receipt = null;
  try {
    const stripeCharge = await api.payment.getStripeCharge.query({
        sessionId: 
        (Array.isArray(stripeSessionId)
          ? stripeSessionId[0]
          : stripeSessionId) || ""
      });
    if (
      !stripeCharge ||
      !stripeCharge.paid
    )
      redirect(redirectTo);
      receipt = stripeCharge.receipt_url;
  } catch (err) {
    console.error(err);
    redirect(redirectTo);
  }

  return <PaymentSuccess receipt={receipt} />;
};

export default Success;

