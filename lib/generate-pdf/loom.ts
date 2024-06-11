import jsPDF from "jspdf";
import { TLoomFull } from "../schemas";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export const generatePdf = async (data: TLoomFull[]) => {
  const doc = new jsPDF();

  autoTable(doc, {
    head: [
      [
        "Created At",
        "Shift",
        "Tape Grade Used",
        "Tape Qty Used(Num-Kg)",
        "Fabric Grade",
        "Fabric Qty(Num-Kg)",
        "Loom Waste",
      ],
    ],
    body: data.map((item) => [
      format(item.date!, "dd MMM yyyy"),
      item.shift,
      item.tapeGrade.grade,
      item.tapeQty,
      item.fabricGrade.grade,
      item.fabricQty,
      item.loomWaste,
    ]),
    styles: {
      fontSize: 8,
    },
    margin: { horizontal: 4, vertical: 4 },
  });

  doc.save("loom.pdf");
};
