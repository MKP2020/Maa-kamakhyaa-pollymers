"use client";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CellAction } from "./cell-action";
import { type TGRNFull } from "@/lib/types";
import { getApprovalStatusText, getPOStatusText } from "@/lib/utils";

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
    accessorFn: (data) => format(data.receivedDate!, "dd MMM yyyy"),
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
    accessorFn: (item) => format(item.invoiceDate, "dd MMM yyyy"),
    header: "Invoice Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
