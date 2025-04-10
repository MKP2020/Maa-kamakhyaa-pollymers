import { getCategories } from "@/actions/category";
import { getTableList } from "@/actions/table-list";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/table-list-tables/columns";
import { TableListTable } from "@/components/tables/table-list-tables/table-list-table";
import { canAccessPage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

const breadcrumbItems = [{ title: "Item", link: "/dashboard/item" }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  const aUser = await currentUser();

  canAccessPage(aUser, "table-list");

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const search = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const data = await getTableList(offset, pageLimit, search as string | null);

  const total = data.total; //1000
  const pageCount = Math.ceil(total / pageLimit);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <TableListTable
          columns={columns}
          data={data.data}
          pageNo={page}
          searchKey="name"
          total={total}
          loading={false}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
