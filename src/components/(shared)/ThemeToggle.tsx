"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "~/components/ui/Button";

const ThemeToggle = () => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        document.documentElement.classList.toggle("dark");
      }}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
};

export default ThemeToggle;
