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

import { Button } from "@/components/ui/button";
import GRNPdf from "@/components/pdf-view/grn-pdf";
import { TGRNFull } from "@/lib/types";
import { deleteGrn } from "@/actions/grn";
import { deleteTableList } from "@/actions/table-list";
import { format } from "date-fns";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface CellActionProps {
  data: TGRNFull;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();

  // const onConfirm = async () => {
  //   deleteTableList(data.id);
  // };

  const savePdf = () => {
    const doc = new jsPDF();
  };

  const onConfirmDelete = async () => {
    try {
      await deleteGrn(data.id);
      setShowDelete(false);
      toast({
        title: "Success",
        description: "GRN deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to delete GRN",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <GRNPdf
        data={data}
        visible={open}
        onClose={() => {
          setOpen(false);
        }}
      />
      <AlertDialog open={showDelete} onOpenChange={(opn) => setShowDelete(opn)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
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
              router.push(`/dashboard/grn/${data.id}`);
            }}
          >
            <Edit3 className="mr-2 h-4 w-4" /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpen(true);
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
