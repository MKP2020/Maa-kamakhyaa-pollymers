"use client";
import { deleteTableList } from "@/actions/table-list";
import PoPdf from "@/components/pdf-view/po-pdf";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TIndent, TPurchaseOrder } from "@/lib/types";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";
import { Edit3, DownloadCloud, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CellActionProps {
  data: TPurchaseOrder;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [pdfVisible, setPdfVisible] = useState(false);
  const onConfirm = async () => {
    deleteTableList(data.id);
  };

  const savePdf = () => {
    const doc = new jsPDF();
  };

  return (
    <>
      <PoPdf
        onClose={() => {
          setPdfVisible(false);
        }}
        data={data}
        visible={pdfVisible}
      />
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
              router.push(`/dashboard/purchase-order/${data.id}`);
            }}
          >
            <Edit3 className="mr-2 h-4 w-4" /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setPdfVisible(true);
            }}
          >
            <DownloadCloud className="mr-2 h-4 w-4" /> Download PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
