"use client";

import { FC } from "react";
import { Separator } from "~/components/ui/Separator";
import { Button } from "~/components/ui/Button";
import { useState } from "react";
import { api } from "~/trpc/react";
import getStripe from "~/lib/get-stripe";
import { TRPCError } from "@trpc/server";
import { toast } from "~/hooks/use-toast";

interface PaymentListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  paymentInfo: {
    feeId: string;
    for: string;
    amount: number;
    paid: boolean;
  };
}

const PaymentListItem: FC<PaymentListItemProps> = ({
  paymentInfo,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const createCheckout = api.payment.createCheckout.useMutation();

  const downloadReceipt = () => {
    setIsLoading(true);
    setIsLoading(false);
  };

  const payFee = async () => {
    setIsLoading(true);
    try {
      const response = await createCheckout.mutateAsync({
        feeId: paymentInfo.feeId,
      });
      const stripe = await getStripe();

      if (stripe !== null) {
        await stripe.redirectToCheckout({
          sessionId: response.id,
        });
      }
    } catch (e) {
      const err = e as TRPCError;
      console.error(err);
      toast({title: "Error", description: "There was a problem processing your request", variant: "destructive"})
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="flex items-center gap-4" {...props}>
        <div className="flex flex-[2] items-center">{paymentInfo.for}</div>
        <div className="flex flex-1 items-center">₹{paymentInfo.amount}</div>
        <div className="flex flex-1 items-center">
          {paymentInfo.paid ? <span className="">PAID</span> : null}
        </div>
        <div className="flex flex-1 items-center">
          {paymentInfo.paid ? (
            <Button
              variant="outline"
              isLoading={isLoading}
              onClick={downloadReceipt}
            >
              Invoice
            </Button>
          ) : (
            <Button isLoading={isLoading} onClick={payFee}>
              Pay
            </Button>
          )}
        </div>
      </div>
      <Separator />
    </>
  );
};

export default PaymentListItem;
