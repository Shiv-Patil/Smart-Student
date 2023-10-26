import PaymentListItem from "~/components/(student)/PaymentListItem";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { Separator } from "~/components/ui/Separator";
import { api } from "~/trpc/server";

const Finance = async () => {
  const allFees = await api.payment.getAllFees.query();

  return (
    <>
      <Card className="mt-24 w-full">
        <CardHeader>
          <CardTitle>Finance</CardTitle>
          <CardDescription>Payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full flex-col gap-2 py-4">
            <div className="flex items-center gap-4 text-xs py-4 text-secondary-foreground">
              <div className="flex flex-[2] items-center">Payment</div>
              <div className="flex flex-1 items-center">Amount</div>
              <div className="flex flex-1 items-center">Status</div>
              <div className="flex flex-1 items-center">Action</div>
            </div>
            <Separator />
            {allFees.map((fee) => (
              <PaymentListItem
                paymentInfo={{
                  feeId: fee.id,
                  for: fee.for,
                  amount: fee.amount,
                  paid: fee.paid,
                }}
                key={fee.id}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="text-xs text-secondary-foreground">
          Payments powered by Stripe
        </CardFooter>
      </Card>
    </>
  );
};

export default Finance;
