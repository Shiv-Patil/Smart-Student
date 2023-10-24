"use client";

import { Button } from "./ui/Button";
import { signOut } from "next-auth/react";
import { FC, useState } from "react";
import { cn } from "~/lib/utils";

interface LogoutBtnProps {
  className?: string;
}

const LogoutBtn: FC<LogoutBtnProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const logout = async () => {
    setIsLoading(true);

    try {
      await signOut();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      className={cn("w-fit", className)}
      onClick={logout}
      isLoading={isLoading}
    >
      Sign Out
    </Button>
  );
};

export default LogoutBtn;
