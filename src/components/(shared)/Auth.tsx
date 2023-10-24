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
import { useEffect, useState } from "react";
import { Icons } from "~/components/Icons";
import { useToast } from "~/hooks/use-toast";
import { useSearchParams, useRouter } from "next/navigation";

const Auth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = params.get("error");
    if (error && error === "AccessDenied") {
      toast({
        title: "Error",
        description: "Invalid professor email",
        variant: "destructive",
      });
      router.replace("/");
    } else if (params.get("verifyRequest") === "") {
      toast({
        title: "Success",
        description: "Sign in link sent to your email id.",
      });
      router.replace("/");
    }
  }, [params]);

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
    <div className="flex w-[24rem] flex-1 flex-col items-center justify-center gap-4">
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
