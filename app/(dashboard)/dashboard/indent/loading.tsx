import { getIndents } from "@/actions/indent";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/indent-tables/columns";
import { IndentTable } from "@/components/tables/indent-tables/indent-table";

const breadcrumbItems = [{ title: "Indent", link: "/dashboard/indent" }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <IndentTable
          columns={columns}
          data={[]}
          pageNo={0}
          searchKey="indentNumber"
          total={1}
          loading
          pageCount={1}
        />
      </div>
    </>
  );
}
