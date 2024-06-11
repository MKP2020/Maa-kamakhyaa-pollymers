import jsPDF from "jspdf";
import { TRpFull } from "../schemas";
import autoTable, { RowInput } from "jspdf-autotable";
import { format } from "date-fns";
import {
  RP_CONSUMED_Table_TITLE,
  RP_PRODUCED_Table_TITLE,
  RP_TYPE,
} from "../utils";

export const generatePdf = async (type: number, data: TRpFull[]) => {
  const doc = new jsPDF();

  const head: RowInput[] = [];
  const body: RowInput[] = [];
  const headData = ["Date", "Shift"];

  if (type === 4) {
    headData.push("Loom Waste");
    headData.push("Lam Waste");
    headData.push("Tape Waste");
    headData.push("Tarp Waste");
  } else {
    headData.push(RP_CONSUMED_Table_TITLE[type.toString()]);
  }

  headData.push(RP_PRODUCED_Table_TITLE[type.toString()]);
  if (type !== 0) {
    headData.push("Rp Lumps");
  }
  head.push(headData);

  data.forEach((item) => {
    const bodyItems: any[] = [format(item.date!, "dd MMM yyyy"), item.shift];
    if (type === 4) {
      bodyItems.push(item.loomQty || "");
      bodyItems.push(item.lamQty || "");
      bodyItems.push(item.tapeQty || "");
      bodyItems.push(item.tarpQty || "");
    } else {
      bodyItems.push(item.consumedQty || "");
    }

    bodyItems.push(item.producedQty);
    if (type !== 0) {
      bodyItems.push(item.rpLumps);
    }
    body.push(bodyItems);
  });

  autoTable(doc, {
    head,
    body,
    styles: {
      fontSize: 8,
    },
    margin: { horizontal: 4, vertical: 4 },
  });

  doc.save(`rp-${RP_TYPE[type].replace(" ", "-")}.pdf`);
};
