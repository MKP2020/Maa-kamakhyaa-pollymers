import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { TInventoryAggregated } from '@/types';

export const generatePdf = async (data: TInventoryAggregated[]) => {
  const doc = new jsPDF();

  autoTable(doc, {
    head: [
      [
        "Item Name",
        "Category",
        "Department",
        "Record In Stock",
        "Record Used",
        "Total In Stock",
        "Total Used",
        "Total Available",
        "Total Records",
        "Record Created",
        "Record Updated",
      ],
    ],
    body: data.map((item) => [
      item.item.name,
      item.category.name,
      item.department.name,
      `${item.inStockQuantity} ${item.item.unit}`,
      `${item.usedQuantity} ${item.item.unit}`,
      `${item.totalInStock} ${item.item.unit}`,
      `${item.totalUsed} ${item.item.unit}`,
      `${item.availableQuantity} ${item.item.unit}`,
      item.inventoryCount,
      format(item.createdAt, "dd MMM yyyy"),
      format(item.updatedAt, "dd MMM yyyy"),
    ]),
    styles: {
      fontSize: 8,
    },
    margin: { horizontal: 4, vertical: 4 },
  });

  doc.save("inventory-records.pdf");
};
