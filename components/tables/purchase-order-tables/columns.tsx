"use client";
import { formatInTimeZone } from "date-fns-tz";

import { Checkbox } from "@/components/ui/checkbox";
import { TPurchaseOrder } from "@/lib/types";
import { getApprovalStatusText, getPOStatusText } from "@/lib/utils";

import { CellAction } from "./cell-action";

import type { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<TPurchaseOrder>[] = [
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
    accessorKey: "poNumber",
    header: "PO Number",
  },
  {
    accessorFn: (data) => formatInTimeZone(data.date!, "UTC", "dd MMM yyyy"),
    header: "Date",
  },
  {
    accessorKey: "seller.name",
    header: "Seller",
  },
  {
    accessorKey: "indent.indentNumber",
    header: "Indent Number",
  },
  {
    accessorFn: (item) => getApprovalStatusText(item.approvalStatus),
    header: "Approval Status",
  },
  {
    accessorFn: (item) => getPOStatusText(item.status),
    header: "PO Status",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
