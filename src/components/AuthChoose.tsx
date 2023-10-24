"use client";

import { Button } from "./ui/Button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/Accordion";
import ProfAuth from "./ProfAuth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FC, useState } from "react";
import { cn } from "~/lib/utils";
import { Icons } from "./Icons";
import { useToast } from "~/hooks/use-toast";

interface AuthChooseProps extends React.HTMLAttributes<HTMLDivElement> {}

const AuthChoose: FC<AuthChooseProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn("google");
    } catch (error) {
      // toast
      toast({
        title: "There was a problem",
        description: "An error occured while logging you in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "container flex max-w-md flex-col items-center gap-4",
        className,
      )}
      {...props}
    >
      <h2 className="mb-6 text-4xl">Welcome.</h2>
      <Button
        size="lg"
        className="w-full"
        onClick={loginWithGoogle}
        isLoading={isLoading}
      >
        {isLoading ? null : <Icons.google className="mr-2 h-4 w-4" />}
        Continue as a student
      </Button>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Are you a professor?</AccordionTrigger>
          <AccordionContent>
            <ProfAuth />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AuthChoose;
