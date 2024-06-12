import { TIndent } from "../types";

export const generateIndentPdf = async (data: TIndent) => {
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
