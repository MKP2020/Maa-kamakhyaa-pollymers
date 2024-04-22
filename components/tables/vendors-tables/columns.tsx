"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { TVendorsFull } from "@/lib/schema";
import { format } from "date-fns";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<TVendorsFull>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Vendor Name",
  },
  {
    accessorKey: "emailId",
    header: "Email",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "pan",
    header: "PAN",
  },
  { accessorKey: "gstNumber", header: "GSTN" },
  {
    // accessorFn: (data) =>
    //   `${data.bankDerails.accountNumber}\n${data.bankDerails.ifsc}\n${data.bankDerails.ifsc}`,
    cell: ({ row }) => {
      console.log("row", row);
      return (
        <>
          <p className="text-sm font-medium leading-none">Account Number</p>
          <p className="text-sm text-muted-foreground">
            {row.original.bankDetails.accountNumber}
          </p>
          <p className="text-sm font-medium leading-none">IFSC</p>
          <p className="text-sm text-muted-foreground">
            {row.original.bankDetails.ifsc}
          </p>
          <p className="text-sm font-medium leading-none">Branch</p>
          <p className="text-sm text-muted-foreground">
            {row.original.bankDetails.branch}
          </p>
        </>
      );
    },
    header: "Bank Details",
  },
  {
    cell: ({ row }) => {
      return (
        <>
          <p className="text-sm font-medium leading-none">Address</p>
          <p className="text-sm text-muted-foreground">
            {row.original.address.addressLine1}
          </p>
          <p className="text-sm text-muted-foreground">
            {row.original.address.addressLine2},
          </p>
          <p className="text-sm text-muted-foreground">
            {row.original.address.city},{row.original.address.district}
          </p>
          <p className="text-sm text-muted-foreground">
            {row.original.address.state},{row.original.address.pinCode}
          </p>
        </>
      );
    },
    header: "Address",
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
