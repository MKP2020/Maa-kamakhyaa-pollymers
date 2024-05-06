"use client";
import { deleteTableList } from "@/actions/table-list";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TIndent } from "@/lib/types";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";
import { Edit3, DownloadCloud, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CellActionProps {
  data: TIndent;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    deleteTableList(data.id);
  };

  const savePdf = () => {
    const doc = new jsPDF();

    const pdfData: UserOptions = {
      head: [["Si.No", "Item", "Indented Quantity", "Approved Quantity"]],
      body: data.items.map((item, index) => [
        `${index + 1}`,
        item.item.name,
        item.indentedQty.toString(),
        item.approvedQty?.toString() || "",
      ]),
      margin: { top: 60, left: 4, right: 4 },
    };

    doc.text(`Department: ${data.department.name}`, 4, 10, {});
    doc.text(`Si.No: ${data.indentNumber}`, 4, 20);
    doc.text(`date: ${format(data.date, "dd/MM/yyyy")}`, 4, 30);
    doc.text(`note: ${data.note || ""}`, 4, 40);
    console.log("pdfData", pdfData);
    autoTable(doc, pdfData);

    doc.save("indent-" + data.indentNumber + ".pdf");
  };
  return (
    <>
      {/* <AlertDialog open={open} onOpenChange={(opn) => setOpen(opn)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => {
              router.push(`/dashboard/indent/${data.id}`);
            }}
          >
            <Edit3 className="mr-2 h-4 w-4" /> View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={savePdf}>
            <DownloadCloud className="mr-2 h-4 w-4" /> Download PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
