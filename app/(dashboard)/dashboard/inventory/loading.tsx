import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/inventory-tables/columns";
import { InventoryTable } from "@/components/tables/inventory-tables/inventory-table";

const breadcrumbItems = [{ title: "Inventory", link: "/dashboard/inventory" }];

export default async function Page() {
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <InventoryTable
        columns={columns as any}
        data={[]}
        date={new Date().toISOString()}
        pageNo={0}
        searchKey="poNumber"
        total={0}
        loading
        pageCount={0}
      />
    </div>
  );
}
