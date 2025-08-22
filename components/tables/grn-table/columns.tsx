"use client";

import { formatInTimeZone } from "date-fns-tz";

import { Checkbox } from "@/components/ui/checkbox";
import { TGRNFull } from "@/lib/types";
import { getApprovalStatusText, getPOStatusText } from "@/lib/utils";

import { CellAction } from "./cell-action";

import type { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<TGRNFull>[] = [
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
    accessorKey: "grnNumber",
    header: "GRN Number",
  },
  {
    accessorFn: (data) =>
      formatInTimeZone(data.receivedDate, "UTC", "dd MMM yyyy"),
    header: "Received Date",
  },
  {
    accessorKey: "po.poNumber",
    header: "PO Number",
  },
  {
    accessorKey: "invoiceNumber",
    header: "Invoice Number",
  },

  {
    accessorFn: (item) =>
      formatInTimeZone(item.invoiceDate, "UTC", "dd MMM yyyy"),
    header: "Invoice Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
