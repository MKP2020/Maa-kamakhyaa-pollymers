import { getDepartments } from "@/actions/department";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/department-table/columns";
import { DepartmentTable } from "@/components/tables/department-table/department-table";

const breadcrumbItems = [
  { title: "Departments", link: "/dashboard/department" },
];

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

  const { data, total } = await getDepartments(
    offset,
    pageLimit,
    search as string
  );

  const pageCount = Math.ceil(total / pageLimit);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <DepartmentTable
          pageCount={pageCount}
          totalCategories={total}
          pageNo={page}
          searchKey="name"
          columns={columns}
          data={data}
        />
      </div>
    </>
  );
}
