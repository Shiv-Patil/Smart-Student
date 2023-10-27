"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, Edit2, Plus } from "lucide-react";
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
  DialogClose,
} from "~/components/ui/Dialog";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";

export type Grade = {
  id: string;
  courseId: string;
  courseName: string;
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
          <span className="ml-2">{column.getIsSorted()}</span>
        </>
      );
    },
  },
  {
    accessorKey: "courseId",
    header: () => <div className="mr-2 w-32 text-right">Course</div>,
    cell: ({ row }) => (
      <div className="mr-2 w-32 text-right">{row.getValue("courseId")}</div>
    ),
  },
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => {
      const grade: string = row.getValue("grade");
      return (
        <Dialog>
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
            <div className="flex items-center space-x-2 gap-4">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="gradeInput" className="sr-only">
                  Grade
                </Label>
                <Input id="gradeInput" defaultValue={grade} placeholder="grade (eg. 'B')" />
              </div>
              <Button type="submit" size="sm" className="px-3">
                <span className="sr-only">Update</span>
                <Check className="h-4 w-4" />
              </Button>
            </div>
            <DialogFooter className="sm:justify-start text-xs text-muted-foreground">
              editing grade for {row.getValue("studentEmail")}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
