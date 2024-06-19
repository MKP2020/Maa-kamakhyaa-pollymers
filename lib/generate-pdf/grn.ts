import { RefObject } from "react";
import { TIndent } from "../types";
import jsPDF from "jspdf";

import html2canvas from "html2canvas";

export const generatePdfWithApi = async (data: TIndent) => {
  const response = await fetch("/api/indent-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "indent.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } else {
    console.error("Failed to generate PDF");
  }
};
export const generateGrnPdf = async (ref: RefObject<any>, name: string) => {
  const inputData = ref.current;

  const canvas = await html2canvas(inputData);
  const img = canvas.toDataURL("image/webp");

  const doc = new jsPDF({ unit: "px", format: "a4" });

  const width = doc.internal.pageSize.width - 8;
  const height = (canvas.height * width) / canvas.width;

  doc.addImage(img, "PNG", 4, 0, width, height);
  doc.save(`grn-${name}.pdf`);
  doc.close();
};
