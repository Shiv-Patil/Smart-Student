"use client";

import { Button } from "~/components/ui/Button";
import { Download } from "lucide-react";
import { toast } from "~/hooks/use-toast";

const PaymentSuccess = ({ receipt }: { receipt: string | null }) => {
  const downloadReceipt = async () => {
    if (receipt) window.open(receipt, "_blank");
    else
      toast({
        title: "Error",
        description: "Unable to access the receipt",
        variant: "destructive",
      });
  };

  return (
    <div className="flex w-[24rem] flex-1 flex-col items-center justify-center gap-4">
      <h2 className="mb-4 text-4xl">Payment Successful.</h2>
      <Button size="lg" className="w-full" onClick={downloadReceipt}>
        <Download className="mr-2 h-4 w-4" />
        View receipt
      </Button>
    </div>
  );
};

export default PaymentSuccess;
