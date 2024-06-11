import jsPDF from "jspdf";
import { TInventoryFull } from "../schemas";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export const generatePdf = async (data: TInventoryFull[]) => {
  const doc = new jsPDF();

  autoTable(doc, {
    head: [
      [
        "Item Name",
        "Created At",
        "Category",
        "Department",
        "In Stock",
        "Used Qty",
      ],
    ],
    body: data.map((item) => [
      item.item.name,
      format(item.createdAt!, "dd MMM yyyy"),
      item.category.name,
      item.department.name,
      item.inStockQuantity,
      item.usedQuantity,
    ]),
    styles: {
      fontSize: 8,
    },
    margin: { horizontal: 4, vertical: 4 },
  });

  doc.save("inventory.pdf");
};
