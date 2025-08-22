"use client";
import { formatInTimeZone } from "date-fns-tz";

import { Checkbox } from "@/components/ui/checkbox";

import { CellAction } from "./cell-action";

import type { ColumnDef } from "@tanstack/react-table";
import type { TWashingUnitFull } from "@/lib/schema";
export const columns: ColumnDef<TWashingUnitFull, any>[] = [
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
    accessorFn: (data) => formatInTimeZone(data.date!, "UTC", "dd MMM yyyy"),
    header: "Date",
  },
  {
    accessorFn: (data) => data.items.length,
    header: "Total Items",
  },
  {
    accessorFn: (data) => data.bhusaQuantity,
    header: "Bhusa Produced Qty",
  },
  {
    accessorKey: "shift",
    header: "Shift",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
