"use client";
import { formatInTimeZone } from "date-fns-tz";

import { Checkbox } from "@/components/ui/checkbox";
import { TGrade } from "@/lib/types";
import { GRADE_TYPES } from "@/lib/utils";

import { CellAction } from "./cell-action";

import type { ColumnDef } from "@tanstack/react-table";
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
    accessorFn: (data) =>
      formatInTimeZone(data.createdAt!, "UTC", "dd MMM yyyy"),
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
