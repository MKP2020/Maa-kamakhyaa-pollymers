import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/loom-table/columns";
import { getLoomList } from "@/actions/loom";
import { LoomTable } from "@/components/tables/loom-table/loom-table";

const breadcrumbItems = [{ title: "Loom", link: "/dashboard/loom" }];

type paramsProps = {
  searchParams: {
    [key: string]: string | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;

  const shift = searchParams.shift;
  const offset = (page - 1) * pageLimit;
  const from = searchParams.from || undefined;
  const to = searchParams.to || undefined;

  const { data, total } = await getLoomList(shift, from, to, offset);

  const pageCount = Math.ceil(total / pageLimit);

  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <LoomTable
        from={from}
        to={to}
        pageCount={pageCount}
        total={total}
        pageNo={page}
        searchKey="name"
        columns={columns as any}
        data={data as any}
      />
    </div>
  );
}
