import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function gradePoints(grade: String) {
  switch (grade) {
    case "A":
      return 10;
    case "A-":
      return 9;
    case "B":
      return 8;
    case "B-":
      return 7;
    case "C":
      return 6;
    case "C-":
      return 5;
    case "D":
      return 4;
    case "D-":
      return 3;
    case "E":
      return 2;
    default:
      return 0;
  }
}
