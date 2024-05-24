import { getInventory } from "@/actions/inventory";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/inventory-tables/columns";
import { InventoryTable } from "@/components/tables/inventory-tables/inventory-table";

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const breadcrumbItems = [{ title: "Inventory", link: "/dashboard/inventory" }];

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const search = searchParams.search || undefined;
  const date = (searchParams.date as string) || undefined;
  const offset = (page - 1) * pageLimit;

  const { data, total } = await getInventory(
    search as any,
    date,
    offset,
    pageLimit
  );

  console.log("data", JSON.stringify(data));

  const pageCount = Math.ceil(total / pageLimit);

  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <InventoryTable
        columns={columns as any}
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
