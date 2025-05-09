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
import { type TRpFull } from "@/lib/schemas";
import jsPDF from "jspdf";
import { Edit3, DownloadCloud, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CellActionProps {
  data: TRpFull;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    deleteTableList(data.id);
  };

  const savePdf = () => {
    const doc = new jsPDF();
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
              router.push(`/dashboard/rp/${data.id}`);
            }}
          >
            <Edit3 className="mr-2 h-4 w-4" /> View
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={savePdf}>
            <DownloadCloud className="mr-2 h-4 w-4" /> Download PDF
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
