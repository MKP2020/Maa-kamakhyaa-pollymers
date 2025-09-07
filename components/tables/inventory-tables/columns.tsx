"use client";
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { Checkbox } from '@/components/ui/checkbox';
import { TInventoryAggregated } from '@/types';

import { CellAction } from './cell-action';

import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TInventoryAggregated>[] = [
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
    accessorFn: (data) => {
      return data.item.name;
    },
    header: "Item Name",
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "department.name",
    header: "Department",
  },
  {
    accessorFn: (data) => {
      return `${data.inStockQuantity} ${data.item.unit}`;
    },
    header: "Record In Stock",
  },
  {
    accessorFn: (data) => {
      return `${data.usedQuantity} ${data.item.unit}`;
    },
    header: "Record Used",
  },
  {
    accessorFn: (data) => {
      return `${data.totalInStock} ${data.item.unit}`;
    },
    header: "Total In Stock",
  },
  {
    accessorFn: (data) => {
      return `${data.totalUsed} ${data.item.unit}`;
    },
    header: "Total Used",
  },
  {
    accessorFn: (data) => {
      return `${data.availableQuantity} ${data.item.unit}`;
    },
    header: "Total Available",
  },
  {
    accessorFn: (data) => {
      return data.inventoryCount;
    },
    header: "Total Records",
  },
  {
    accessorFn: (data) =>
      formatInTimeZone(data.createdAt, "UTC", "dd MMM yyyy"),
    header: "Record Created",
  },
  {
    accessorFn: (data) =>
      formatInTimeZone(data.updatedAt, "UTC", "dd MMM yyyy"),
    header: "Record Updated",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
