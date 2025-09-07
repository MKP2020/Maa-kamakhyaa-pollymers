import * as XLSX from 'xlsx';

import { TInventoryAggregated } from '@/types';

export const generateExcel = async (data: TInventoryAggregated[]) => {
  // Prepare the data for Excel
  const excelData = data.map((item) => ({
    "Item Name": item.item.name,
    Category: item.category.name,
    Department: item.department.name,
    "Record In Stock": `${item.inStockQuantity} ${item.item.unit}`,
    "Record Used": `${item.usedQuantity} ${item.item.unit}`,
    "Total In Stock": `${item.totalInStock} ${item.item.unit}`,
    "Total Used": `${item.totalUsed} ${item.item.unit}`,
    "Total Available": `${item.availableQuantity} ${item.item.unit}`,
    "Total Records": item.inventoryCount,
    "Record Created": new Date(item.createdAt).toLocaleDateString(),
    "Record Updated": new Date(item.updatedAt).toLocaleDateString(),
  }));

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Create a worksheet from the data
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 20 }, // Item Name
    { wch: 15 }, // Category
    { wch: 15 }, // Department
    { wch: 15 }, // Record In Stock
    { wch: 15 }, // Record Used
    { wch: 15 }, // Total In Stock
    { wch: 15 }, // Total Used
    { wch: 15 }, // Total Available
    { wch: 12 }, // Total Records
    { wch: 15 }, // Record Created
    { wch: 15 }, // Record Updated
  ];
  worksheet["!cols"] = columnWidths;

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Records");

  // Generate the Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Create a blob and download
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "inventory-records.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
