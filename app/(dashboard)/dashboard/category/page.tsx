import { getCategories } from "@/actions/category";
import BreadCrumb from "@/components/breadcrumb";
import { CategoryTable } from "@/components/tables/category-tables/category-table";
import { columns } from "@/components/tables/category-tables/columns";
import { UserClient } from "@/components/tables/user-tables/client";

const breadcrumbItems = [{ title: "Category", link: "/dashboard/category" }];

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

  const data = await getCategories(
    offset,
    pageLimit,
    category as string | null
  );

  const total = data.total; //1000
  const pageCount = Math.ceil(total / pageLimit);

  console.log("data", data);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <CategoryTable
          pageCount={pageCount}
          totalCategories={total}
          pageNo={page}
          searchKey="name"
          columns={columns}
          data={data.data}
        />
      </div>
    </>
  );
}
