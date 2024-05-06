"use client";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import type { TTableListFull } from "@/lib/schema";
import { format } from "date-fns";
import { CellAction } from "./cell-action";
import { TIndent } from "@/lib/types";

export const columns: ColumnDef<TIndent>[] = [
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
    accessorKey: "indentNumber",
    header: "Indent Number",
  },
  {
    accessorFn: (data) => format(data.date!, "dd MMM yyyy"),
    header: "Date",
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "department.name",
    header: "Department Name",
  },
  {
    accessorFn: (item) => item.items.length,
    header: "Total Items",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
