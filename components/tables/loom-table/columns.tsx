"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { TLoomFull } from "@/lib/schema";
import { formatInTimeZone } from "date-fns-tz";

import { CellAction } from "./cell-action";

export const columns: ColumnDef<TLoomFull>[] = [
  {
    accessorFn: (data) => formatInTimeZone(data.date!, "UTC", "dd MMM yyyy"),
    header: "Created At",
  },
  {
    accessorKey: "shift",
    header: "Shift",
  },
  {
    accessorFn: (data) => data.tapeGrade.grade,
    header: "Tape Grade",
  },
  {
    accessorKey: "tapeQty",
    header(props) {
      return (
        <div className="flex flex-col">
          <span>Tape Quantity</span>
          <span>(Num - Kg)</span>
        </div>
      );
    },
  },
  {
    accessorFn: (data) => data.fabricGrade.grade,
    header: "Fabric Grade",
  },
  {
    accessorKey: "fabricQty",
    header(props) {
      return (
        <div className="flex flex-col">
          <span>Fabric Quantity</span>
          <span>(Num - Kg)</span>
        </div>
      );
    },
  },
  {
    accessorKey: "loomWaste",

    header: "Loom Waste",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
