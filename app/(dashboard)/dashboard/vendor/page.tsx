import { getVendors } from "@/actions/vendor";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/vendors-tables/columns";
import { VendorTable } from "@/components/tables/vendors-tables/vendors-table";

const breadcrumbItems = [{ title: "Category", link: "/dashboard/vendor" }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const category = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const data = await getVendors();

  const total = data.total; //1000
  const pageCount = Math.ceil(total / pageLimit);

  console.log("data.data", data.data);
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <VendorTable
          pageCount={pageCount}
          total={total}
          pageNo={page}
          searchKey="name"
          columns={columns}
          data={data.data}
        />
      </div>
    </>
  );
}
