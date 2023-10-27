"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, Edit2, Loader, Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { Checkbox } from "~/components/ui/Checkbox";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/Dialog";
import { Input } from "~/components/ui/Input";
import { api } from "~/trpc/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { toast } from "~/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

const grades = ["A", "A-", "B", "B-", "C", "C-", "D", "D-", "E", "RC", "NC"];
const FormSchema = z.object({
  grade: z
    .string()
    .min(1, { message: "Field cannot be empty" })
    .max(2)
    .refine((str) => grades.includes(str), { message: "Invalid Grade." }),
});

export type Grade = {
  id: string;
  courseCode: string;
  courseName: string;
  doesTeach: boolean;
  grade: string | null;
  studentName: string;
  studentEmail: string;
};

export const columns: ColumnDef<Grade>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "studentName",
    header: "Name",
  },
  {
    accessorKey: "studentEmail",
    header: ({ column }) => {
      return (
        <>
          <Button
            variant="outline"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </>
      );
    },
  },
  {
    accessorKey: "courseCode",
    header: () => <div className="mr-2 w-32 text-right">Course</div>,
    cell: ({ row }) => (
      <div className="mr-2 w-32 text-right">{row.getValue("courseCode")}</div>
    ),
  },
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => {
      if (!row.original.doesTeach) return row.getValue("grade");

      const updateGrade = api.grading.updateGrades.useMutation();
      const [open, setOpen] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
      const router = useRouter();

      const grade: string = row.getValue("grade") || "";
      const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          grade: grade,
        },
      });
      const updateGradeBtn = async (data: z.infer<typeof FormSchema>) => {
        setIsLoading(true);
        try {
          if (
            (
              await updateGrade.mutateAsync({
                courseId: [row.original.id],
                newGrade: data.grade,
              })
            ).count > 0
          )
            router.refresh();
        } catch (err) {
          console.error(err);
          toast({
            title: "Error",
            description: "There was a problem processing your request",
            variant: "destructive",
          });
        } finally {
          setOpen(false);
          setIsLoading(false);
        }
      };

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          {grade ? (
            <div className="flex items-center">
              {grade}
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="ml-4 h-6 w-6">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </div>
          ) : (
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-6 w-6">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          )}
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Grade</DialogTitle>
              <DialogDescription>Add/Modify/Remove grade</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                className="flex items-center gap-4 space-x-2"
                onSubmit={form.handleSubmit(updateGradeBtn)}
              >
                <div className="grid flex-1 gap-2">
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="gradeInput" className="sr-only">
                          Grade
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="gradeInput"
                            placeholder="grade (eg. 'B')"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className="px-3"
                  disabled={isLoading}
                >
                  <span className="sr-only">Update</span>
                  {isLoading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </Form>
            <DialogFooter className="mt-1 text-xs sm:justify-start">
              <span className="text-muted-foreground">editing: &#8203;</span>
              {row.getValue("courseCode")}
              <span className="text-muted-foreground">for: &#8203;</span>
              {row.getValue("studentEmail")}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
