import jsPDF from "jspdf";
import { TWashingUnitFull } from "../schemas";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export const generatePdf = async (data: TWashingUnitFull[]) => {
  const doc = new jsPDF();

  autoTable(doc, {
    head: [["Date", "Shift", "Total Items", "Bhusa Produced Qty"]],
    body: data.map((item) => [
      format(item.date!, "dd MMM yyyy"),
      item.shift,
      item.items.length,
      item.bhusaQuantity,
    ]),
    styles: {
      fontSize: 8,
    },
    margin: { horizontal: 4, vertical: 4 },
  });

  doc.save("washing-units.pdf");
};
