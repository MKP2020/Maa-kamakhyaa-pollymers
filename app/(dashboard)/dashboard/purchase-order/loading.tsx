import { getPurchaseOrders } from "@/actions/purchaseOrder";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/purchase-order-tables/columns";
import { PurchaseOrderTable } from "@/components/tables/purchase-order-tables/purchase-order-table";

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const breadcrumbItems = [
  { title: "Purchase Order", link: "/dashboard/purchase-order" },
];

export default async function Page({ searchParams }: paramsProps) {
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <PurchaseOrderTable
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
