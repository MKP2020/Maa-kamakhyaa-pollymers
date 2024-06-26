import { RefObject } from "react";
import jsPDF from "jspdf";

import html2canvas from "html2canvas";

export const generatePoPdf = async (ref: RefObject<any>, name: string) => {
  const inputData = ref.current;

  const canvas = await html2canvas(inputData);
  const img = canvas.toDataURL("image/webp");

  const doc = new jsPDF({ unit: "px", format: "a4" });

  const width = doc.internal.pageSize.width - 8;
  const height = (canvas.height * width) / canvas.width;

  doc.addImage(img, "WEBP", 4, 0, width, height);
  doc.save(`po-${name}.pdf`);
  doc.close();
};
