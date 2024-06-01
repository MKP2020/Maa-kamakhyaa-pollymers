"use client";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CellAction } from "./cell-action";
import { type TGrade } from "@/lib/types";
import { GRADE_TYPES } from "@/lib/utils";

export const columns: ColumnDef<TGrade>[] = [
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
    accessorFn: (data) => GRADE_TYPES[data.type],
    header: "Type",
  },
  {
    accessorKey: "grade",
    header: "Fabric Grade",
  },
  {
    accessorFn: (data) => format(data.createdAt!, "dd MMM yyyy"),
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
