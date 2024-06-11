import jsPDF from "jspdf";
import { TTarpaulinFull } from "../schemas";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export const generatePdf = async (data: TTarpaulinFull[], name: string) => {
  const doc = new jsPDF();

  autoTable(doc, {
    head: [
      [
        "Created At",
        "Shift",
        "Lam Fabric Grade",
        "Lam Fabric Quantity",
        "Tarpaulin Grade",
        "Size",
        "Tarpaulin Quantity",
        "Tarp Waste",
      ],
    ],
    body: data.map((item) => [
      format(item.date!, "dd MMM yyyy"),
      item.shift,
      item.lamFabricGrade.grade,
      item.lamFabricQty,
      item.tarpaulinGrade.grade,
      item.tarpaulinSize,
      item.tarpaulinQty,
      item.tarpWaste,
    ]),
    styles: {
      fontSize: 8,
    },
    margin: { horizontal: 4, vertical: 4 },
  });

  doc.save(name + ".pdf");
};
