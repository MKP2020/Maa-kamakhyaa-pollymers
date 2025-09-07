import { formatInTimeZone } from "date-fns-tz";
import { NextRequest } from "next/server";
import * as XLSX from "xlsx";

import { getGrns } from "@/actions/grn";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;

    // Fetch a large page to include all results matching filters
    const { data } = await getGrns(search as any, from as any, to as any);

    const summaryRows: Record<string, any>[] = [];
    const itemRows: Record<string, any>[] = [];

    data.forEach((grn) => {
      // Compute amounts
      const baseTotal = (grn.items || []).reduce((sum: number, inv: any) => {
        const qty = Number(inv?.inStockQuantity || 0);
        const price = Number(inv?.poItem?.price || 0);
        return sum + qty * price;
      }, 0);

      let taxAmount = 0;
      const igstPerc = Number(grn?.igst || 0);
      const cgstPerc = Number(grn?.cgst || 0);
      const sgstPerc = Number(grn?.sgst || 0);

      if (grn?.taxType === "IGST") {
        taxAmount = (baseTotal * igstPerc) / 100;
      } else {
        taxAmount = (baseTotal * cgstPerc) / 100 + (baseTotal * sgstPerc) / 100;
      }

      const freight = Number(grn?.freightAmount || 0);
      const netAmount = baseTotal + taxAmount + freight;

      summaryRows.push({
        "GRN Number": grn.grnNumber,
        "Received Date": grn?.receivedDate
          ? formatInTimeZone(grn.receivedDate, "UTC", "yyyy-MM-dd")
          : "",
        "PO Number": grn?.po?.poNumber || "",
        "Invoice Number": grn?.invoiceNumber || "",
        "Invoice Date": grn?.invoiceDate
          ? formatInTimeZone(grn.invoiceDate, "UTC", "yyyy-MM-dd")
          : "",
        "Mode of Transport": grn?.transportMode || "",
        "Transporter Name": grn?.transportName || "",
        "CN Number": grn?.cnNumber || "",
        "Vehicle Number": grn?.vehicleNumber || "",
        "Freight Amount": freight,
        "Tax Type": grn?.taxType || "",
        "IGST %": igstPerc,
        "CGST %": cgstPerc,
        "SGST %": sgstPerc,
        "Base Amount": baseTotal,
        "Tax Amount": taxAmount,
        "Net Amount": netAmount,
        "Vendor Name": grn?.po?.seller?.name || "",
      });

      (grn.items || []).forEach((inv: any) => {
        const price = inv?.poItem?.price ?? null;
        const qty = Number(inv?.inStockQuantity || 0);
        const amount = price != null ? qty * Number(price) : null;
        itemRows.push({
          "GRN Number": grn.grnNumber,
          "PO Number": grn?.po?.poNumber || "",
          "Received Date": grn?.receivedDate
            ? formatInTimeZone(grn.receivedDate, "UTC", "yyyy-MM-dd")
            : "",
          "Item Name": inv?.item?.name || "",
          Unit: inv?.item?.unit || "",
          Quantity: qty,
          Price: price,
          Amount: amount,
        });
      });
    });

    const workbook = XLSX.utils.book_new();
    const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "GRN");

    const itemsSheet = XLSX.utils.json_to_sheet(itemRows);
    XLSX.utils.book_append_sheet(workbook, itemsSheet, "GRN Items");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=grn.xlsx",
      },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e?.message || "Export failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
