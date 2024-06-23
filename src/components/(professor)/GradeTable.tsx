"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Input } from "~/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/Table";
import { Button } from "~/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isLoading, setIsLoading] = useState(false);
  const updateGrades = api.grading.updateGrades.useMutation();
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const clearSelectedGrades = async () => {
    setIsLoading(true);
    try {
      if (
        (
          await updateGrades.mutateAsync({
            courseId: table
              .getFilteredSelectedRowModel()
              .rows.map((ele: any) => ele.original.id),
            newGrade: "",
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
      setIsLoading(false);
      setDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={!Object.keys(rowSelection).length}
            >
              Clear selected
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clear grades</DialogTitle>
              <DialogDescription>
                This action will clear grades of selected fields.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 p-4">
              {table.getFilteredSelectedRowModel().rows.length} selected rows
              <Button
                variant="destructive"
                onClick={clearSelectedGrades}
                isLoading={isLoading}
              >
                Clear
              </Button>
            </div>
            <DialogFooter className="items-center text-sm text-muted-foreground sm:justify-center">
              NOTE: this will only clear grades of courses that you can edit.
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Input
          placeholder="Filter by course"
          value={
            (table.getColumn("courseCode")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) => {
            table.getColumn("courseCode")?.setFilterValue(event.target.value);
          }}
          className="w-52"
        />

        <Input
          placeholder="Filter by email"
          value={
            (table.getColumn("studentEmail")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) => {
            table.getColumn("studentEmail")?.setFilterValue(event.target.value);
          }}
          className="w-52"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
