"use client";
import jsPDF from 'jspdf';
import { DownloadCloud, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { TInventoryAggregated } from '@/types';

interface CellActionProps {
  data: TInventoryAggregated;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const savePdf = () => {
    const doc = new jsPDF();
    // Add content to PDF based on individual record + total data
    doc.text(`Item: ${data.item.name}`, 20, 20);
    doc.text(`Category: ${data.category.name}`, 20, 30);
    doc.text(`Department: ${data.department.name}`, 20, 40);
    doc.text(
      `Record In Stock: ${data.inStockQuantity} ${data.item.unit}`,
      20,
      50
    );
    doc.text(`Record Used: ${data.usedQuantity} ${data.item.unit}`, 20, 60);
    doc.text(
      `Total In Stock (All Records): ${data.totalInStock} ${data.item.unit}`,
      20,
      70
    );
    doc.text(
      `Total Used (All Records): ${data.totalUsed} ${data.item.unit}`,
      20,
      80
    );
    doc.text(
      `Total Available: ${data.availableQuantity} ${data.item.unit}`,
      20,
      90
    );
    doc.text(`Total Records for Item: ${data.inventoryCount}`, 20, 100);
    doc.text(
      `Record Created: ${new Date(data.createdAt).toLocaleDateString()}`,
      20,
      110
    );
    doc.text(
      `Record Updated: ${new Date(data.updatedAt).toLocaleDateString()}`,
      20,
      120
    );

    doc.save(`${data.item.name}-inventory-record-${data.id}.pdf`);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        {/* <DropdownMenuItem
          onClick={() => {
            router.push(`/dashboard/item/${data.itemId}`);
          }}
        >
          <DownloadCloud className="mr-2 h-4 w-4" /> View Item Details
        </DropdownMenuItem> */}
        <DropdownMenuItem onClick={savePdf}>
          <DownloadCloud className="mr-2 h-4 w-4" /> Download PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
