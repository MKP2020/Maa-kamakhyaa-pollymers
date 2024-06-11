import jsPDF from "jspdf";
import { TTapeFull } from "../schemas";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export const generatePdf = async (data: TTapeFull[]) => {
  const doc = new jsPDF();

  const typedData = [];

  autoTable(doc, {
    head: [
      [
        "Created At",
        "Shift",
        "Tape Grade",
        "Tape Quantity(Num-Kg)",
        "Tape Waste(Num-Kg)",
        "Tape Lumps",
      ],
    ],
    body: data.map((item) => [
      format(item.date!, "dd MMM yyyy"),
      item.shift,
      item.tapeGrade.grade,
      item.tapeQty,
      item.tapeWaste,
      item.tapeLumps,
    ]),
    styles: {
      fontSize: 8,
    },
    margin: { horizontal: 4, vertical: 4 },
  });

  doc.save("tape-plant.pdf");
};
