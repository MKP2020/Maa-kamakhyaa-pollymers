"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Delete, DownloadCloud, Edit3, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TIndent, TPurchaseOrder } from "@/lib/types";
import autoTable, { UserOptions } from "jspdf-autotable";

import { Button } from "@/components/ui/button";
import PoPdf from "@/components/pdf-view/po-pdf";
import { deletePurchaseOrder } from "@/actions/purchaseOrder";
import { deleteTableList } from "@/actions/table-list";
import { format } from "date-fns";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CellActionProps {
  data: TPurchaseOrder;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();

  const [pdfVisible, setPdfVisible] = useState(false);
  const onConfirm = async () => {
    deleteTableList(data.id);
  };

  const savePdf = () => {
    const doc = new jsPDF();
  };

  const onConfirmDelete = () => {
    deletePurchaseOrder(data.id);
    setShowDelete(false);
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
      <AlertDialog open={showDelete} onOpenChange={(opn) => setShowDelete(opn)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will also delete all grns which
              have this selected po
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

          <DropdownMenuItem
            onClick={() => {
              setShowDelete(true);
            }}
          >
            <Delete className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
