"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { TLamFull } from "@/lib/schema";
import { formatInTimeZone } from "date-fns-tz";

import { CellAction } from "./cell-action";

export const columns: ColumnDef<TLamFull>[] = [
  {
    accessorFn: (data) => formatInTimeZone(data.date!, "UTC", "dd MMM yyyy"),
    header: "Created At",
  },
  {
    accessorKey: "shift",
    header: "Shift",
  },
  {
    accessorFn: (data) => data.fabricGrade.grade,
    header: "Fabric Grade",
  },
  {
    accessorKey: "fabricQty",
    header: "Fabric Quantity",
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
    accessorKey: "lamWaste",

    header: "Lam Waste",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
