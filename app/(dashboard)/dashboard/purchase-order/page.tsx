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
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const search = searchParams.search || undefined;
  const date = (searchParams.date as string) || undefined;
  const offset = (page - 1) * pageLimit;

  console.log("date date", date);
  const { data, total } = await getPurchaseOrders(
    search as any,
    date,
    offset,
    pageLimit
  );

  const pageCount = Math.ceil(total / pageLimit);

  console.log("data", data, total);
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <PurchaseOrderTable
        columns={columns}
        data={data as any}
        date={date}
        pageNo={page}
        searchKey="poNumber"
        total={total}
        loading={false}
        pageCount={pageCount}
      />
    </div>
  );
}
