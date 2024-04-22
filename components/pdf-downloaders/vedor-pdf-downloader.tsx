import React, { FC, useCallback } from "react";
import { Button } from "../ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { TVendorsFull } from "@/lib/schema";

const VEndorPDFDownloader: FC<{
  data: TVendorsFull[];
  columns: ColumnDef<any, any>[];
}> = ({ data, columns }) => {
  const onClick = useCallback(() => {
    const doc = new jsPDF();

    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Category",
      "PAN",
      "GSTN",
      "Bank",
      "Address",
    ];
    const body = data.map((item) => {
      console.log("item", item);
      const dItem: (number | string)[] = [];

      dItem.push(item.id);
      dItem.push(item.name);
      dItem.push(item.emailId);
      dItem.push(item.contactNumber);
      dItem.push(item.category.name);
      dItem.push(item.pan);
      dItem.push(item.gstNumber);
      dItem.push(
        `${item.bankDetails.accountNumber}\n${item.bankDetails.ifsc}\n${item.bankDetails.branch}`
      );
      dItem.push(
        `${item.address.addressLine1}\n${item.address.addressLine2}${item.address.city}${item.address.district}\n${item.address.state}\n${item.address.pinCode}`
      );

      return dItem;
    });

    // Or use javascript directly:
    autoTable(doc, {
      tableWidth: "auto",
      bodyStyles: {
        fontSize: 8,
      },
      head: [headers],
      body: body,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    doc.save("vendors.pdf");
  }, [data]);
  return (
    <Button className="text-xs md:text-sm" onClick={onClick}>
      <Download className="mr-2 h-4 w-4" />
      Download
    </Button>
  );
};

export default VEndorPDFDownloader;
