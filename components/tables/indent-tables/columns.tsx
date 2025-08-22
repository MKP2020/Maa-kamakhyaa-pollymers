"use client";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import { Checkbox } from "@/components/ui/checkbox";
import { TIndent } from "@/lib/types";

import { CellAction } from "./cell-action";

import type { ColumnDef } from "@tanstack/react-table";
import type { TTableListFull } from "@/lib/schema";
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
    accessorFn: (data) => formatInTimeZone(data.date!, "UTC", "dd MMM yyyy"),
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
