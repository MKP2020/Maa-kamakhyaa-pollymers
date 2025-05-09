"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { TTarpaulinFull } from "@/lib/schema";
import { format } from "date-fns";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<TTarpaulinFull>[] = [
  {
    accessorFn: (data) => format(data.date!, "dd MMM yyyy"),
    header: "Created At",
  },
  {
    accessorKey: "shift",
    header: "Shift",
  },
  {
    accessorFn: (data) => data.lamFabricGrade.grade,
    header: "Lam Fabric Grade",
  },
  {
    accessorKey: "lamFabricQty",
    header: "Lam Fabric Quantity",
  },
  {
    accessorFn: (data) => data.tarpaulinGrade.grade,
    header: "Tarpaulin Grade",
  },
  {
    accessorKey: "tarpaulinSize",
    header: "Size",
  },
  {
    accessorKey: "tarpaulinQty",
    header: "Tarpaulin Quantity",
  },
  {
    accessorKey: "tarpWaste",
    header: "Tarp Waste",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
