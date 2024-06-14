import { getIndents } from "@/actions/indent";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/indent-tables/columns";
import { IndentTable } from "@/components/tables/indent-tables/indent-table";
import { canAccessPage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

const breadcrumbItems = [{ title: "Indent", link: "/dashboard/indent" }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  const aUser = await currentUser();

  canAccessPage(aUser, "indent");

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const search = searchParams.search || undefined;
  const to = (searchParams.to as string) || undefined;
  const from = (searchParams.from as string) || undefined;
  const offset = (page - 1) * pageLimit;

  const data = await getIndents(search as string, from, to, offset, pageLimit);

  const total = data.total; //1000
  const pageCount = Math.ceil(total / pageLimit);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <IndentTable
          columns={columns}
          data={data.data as any}
          pageNo={page}
          searchKey="indentNumber"
          total={total}
          loading={false}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
