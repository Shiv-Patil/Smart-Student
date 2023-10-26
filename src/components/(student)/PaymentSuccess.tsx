"use client";

import { Button } from "~/components/ui/Button";
import { Download } from "lucide-react";
import { useState } from "react";
import Stripe from "stripe";

const PaymentSuccess = ({invoice}: {invoice: string | Stripe.Invoice | null}) => {
  const [isLoading, setIsLoading] = useState(false);

  const downloadReceipt = async () => {
    setIsLoading(true);
    console.log(invoice);
    setIsLoading(false);
  };

  return (
    <div className="flex w-[24rem] flex-1 flex-col items-center justify-center gap-4">
      <h2 className="mb-4 text-4xl">Payment Successful.</h2>
      <Button
        size="lg"
        className="w-full"
        onClick={downloadReceipt}
        isLoading={isLoading}
      >
        {isLoading ? null : <Download className="mr-2 h-4 w-4" />}
        Download receipt
      </Button>
    </div>
  );
};

export default PaymentSuccess;

