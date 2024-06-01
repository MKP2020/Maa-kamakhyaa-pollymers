"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { TTapeFull } from "@/lib/schema";
import { format } from "date-fns";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<TTapeFull>[] = [
  {
    accessorFn: (data) => format(data.date!, "dd MMM yyyy"),
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
    accessorKey: "tapeWaste",

    header(props) {
      return (
        <div className="flex flex-col">
          <span>Tape Waste</span>
          <span>(Num - Kg)</span>
        </div>
      );
    },
  },
  {
    accessorKey: "tapeLumps",
    header: "Tape Lumps",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
