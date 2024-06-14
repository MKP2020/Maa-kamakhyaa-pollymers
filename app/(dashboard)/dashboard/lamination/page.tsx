import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/lam-table/columns";
import { LamTable } from "@/components/tables/lam-table/lam-table";
import { getLamList } from "@/actions/lam";
import { currentUser } from "@clerk/nextjs/server";
import { canAccessPage } from "@/lib/utils";

const breadcrumbItems = [
  { title: "Lamination", link: "/dashboard/lamination" },
];

type paramsProps = {
  searchParams: {
    [key: string]: string | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  const aUser = await currentUser();
  canAccessPage(aUser, "lamination");

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;

  const shift = searchParams.shift;
  const offset = (page - 1) * pageLimit;
  const from = searchParams.from || undefined;
  const to = searchParams.to || undefined;

  const { data, total } = await getLamList(shift, from, to, offset);

  const pageCount = Math.ceil(total / pageLimit);

  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <LamTable
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
