"use client";
import { formatInTimeZone } from "date-fns-tz";

import { Checkbox } from "@/components/ui/checkbox";
import { getUserRole, TUser } from "@/lib/users";
import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export const columns: ColumnDef<TUser>[] = [
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
    accessorKey: "firstName",
    header: "FIRST NAME",
  },
  {
    accessorKey: "lastName",
    header: "LAST NAME",
  },
  {
    accessorKey: "email",
    header: "ROLE",
  },
  // {
  //   accessorFn: (data) => data.department?.name,
  //   header: "DEPARTMENT",
  // },
  {
    accessorFn: (data) => getUserRole(data.role),
    header: "ROLE",
  },

  {
    accessorFn: (data) =>
      formatInTimeZone(data.createdAt!, "UTC", "dd MMM yyyy"),
    header: "CREATED AT",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
