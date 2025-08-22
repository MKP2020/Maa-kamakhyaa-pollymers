"use client";
import { formatInTimeZone } from "date-fns-tz";

import { Checkbox } from "@/components/ui/checkbox";

import { CellAction } from "./cell-action";

import type { ColumnDef } from "@tanstack/react-table";
import type { TTableListFull } from "@/lib/schema";
export const columns: ColumnDef<TTableListFull>[] = [
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
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Item Name",
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "minQuantity",
    header: "Min Stock Quantity",
  },
  {
    accessorKey: "unit",
    header: "Unit",
  },

  {
    accessorFn: (data) =>
      formatInTimeZone(data.createdAt!, "UTC", "dd MMM yyyy"),
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
