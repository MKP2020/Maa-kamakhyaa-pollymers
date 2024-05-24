import BreadCrumb from "@/components/breadcrumb";
import { GRNTable } from "@/components/tables/grn-table/grn-table";
import { columns } from "@/components/tables/grn-table/columns";
import { getGrns } from "@/actions/grn";

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const breadcrumbItems = [{ title: "GRN", link: "/dashboard/grn" }];

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const search = searchParams.search || undefined;
  const date = (searchParams.date as string) || undefined;
  const offset = (page - 1) * pageLimit;

  const { data, total } = await getGrns(search as any, date, offset, pageLimit);

  const pageCount = Math.ceil(total / pageLimit);

  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <GRNTable
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
