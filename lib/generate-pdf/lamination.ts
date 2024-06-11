import jsPDF from "jspdf";
import { TLamFull } from "../schemas";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export const generatePdf = async (data: TLamFull[]) => {
  const doc = new jsPDF();

  autoTable(doc, {
    head: [
      [
        "Created At",
        "Shift",
        "Fabric Grade",
        "Fabric Quantity",
        "Lam Fabric Grade",
        "Lam Fabric Quantity",
        "Lam Waste",
      ],
    ],
    body: data.map((item) => [
      format(item.date!, "dd MMM yyyy"),
      item.shift,
      item.fabricGrade.grade,
      item.fabricQty,
      item.lamFabricGrade.grade,
      item.lamFabricQty,
      item.lamWaste,
    ]),
    styles: {
      fontSize: 8,
    },
    margin: { horizontal: 4, vertical: 4 },
  });

  doc.save("lamination.pdf");
};
