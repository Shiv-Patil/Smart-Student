"use client";

import { Button } from "~/components/ui/Button";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { useToast } from "~/hooks/use-toast";
import { Input } from "~/components/ui/Input";

const FormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Field cannot be empty" })
    .email("Not a valid email"),
});

const ProfAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const loginWithEmail = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    try {
      await signIn("email", { email: data.email });
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
    <Form {...form}>
      <form
        className="flex w-full flex-col items-center gap-4"
        onSubmit={form.handleSubmit(loginWithEmail)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@xyz.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size="lg" type="submit" className="w-fit" isLoading={isLoading}>
          Continue
        </Button>
      </form>
    </Form>
  );
};

export default ProfAuth;
