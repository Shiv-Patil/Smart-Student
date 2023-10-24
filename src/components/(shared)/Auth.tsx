"use client";

import { Button } from "~/components/ui/Button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/Accordion";
import ProfAuth from "./ProfAuth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Icons } from "~/components/Icons";
import { useToast } from "~/hooks/use-toast";

const Auth = () => {
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
    <div className="flex flex-1 w-[24rem] flex-col items-center justify-center gap-4">
      <h2 className="mb-4 text-4xl">Welcome.</h2>
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
          <AccordionContent className="mt-2">
            <ProfAuth />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Auth;
