"use client";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CellAction } from "./cell-action";
import { type TRpFull } from "@/lib/schemas";
import { RP_CONSUMED_Table_TITLE, RP_PRODUCED_Table_TITLE } from "@/lib/utils";

export const columns: (type: string) => ColumnDef<TRpFull>[] = (type) => {
  const data: ColumnDef<TRpFull>[] = [
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
      accessorFn: (data) => format(data.date!, "dd MMM yyyy"),
      header: "Date",
    },
    {
      accessorKey: "shift",
      header: "Shift",
    },
    {
      accessorKey: "consumedQty",
      header: RP_CONSUMED_Table_TITLE[type],
    },
    {
      accessorKey: "producedQty",
      header: RP_PRODUCED_Table_TITLE[type],
    },
  ];
  if (type !== "0") {
    data.push({
      accessorKey: "rpLumps",
      header: "Rp Lumps",
    });
  }

  data.push({
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  });

  return data;
};
