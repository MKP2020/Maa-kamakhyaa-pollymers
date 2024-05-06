import { getFabrics } from "@/actions/fabric";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/fabric-table/columns";
import { FabricTable } from "@/components/tables/fabric-table/fabric-table";

const breadcrumbItems = [{ title: "Fabric", link: "/dashboard/fabric" }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const search = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const { data, total } = await getFabrics(offset, pageLimit, search as string);

  const pageCount = Math.ceil(total / pageLimit);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <FabricTable
          pageCount={pageCount}
          total={total}
          pageNo={page}
          searchKey="grade"
          columns={columns}
          data={data}
        />
      </div>
    </>
  );
}
