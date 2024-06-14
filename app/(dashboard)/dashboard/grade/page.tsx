import { getGrades } from "@/actions/grade";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/grade-table/columns";
import { GradeTable } from "@/components/tables/grade-table/grade-table";
import { canAccessPage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

const breadcrumbItems = [{ title: "Fabric", link: "/dashboard/grade" }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  const aUser = await currentUser();

  canAccessPage(aUser, "grade");

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const search = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const { data, total } = await getGrades(offset, pageLimit, search as string);

  const pageCount = Math.ceil(total / pageLimit);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <GradeTable
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
