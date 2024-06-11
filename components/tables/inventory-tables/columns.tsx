"use client";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CellAction } from "./cell-action";
import { TInventoryFull } from "@/lib/schemas";

export const columns: ColumnDef<TInventoryFull>[] = [
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
    accessorFn: (data) => {
      return data.item.name;
    },
    // accessorKey: "data.item.item.item.name",
    header: "Item Name",
  },
  {
    accessorFn: (data) => format(data.createdAt!, "dd MMM yyyy"),
    header: "Created At",
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "department.name",
    header: "Department",
  },
  {
    accessorFn: (data) => {
      return data.inStockQuantity;
    },
    header: "In Stock",
  },
  {
    accessorFn: (data) => {
      return data.usedQuantity;
    },
    header: "Used Qty",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
