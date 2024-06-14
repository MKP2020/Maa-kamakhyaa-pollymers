import { getRpList } from "@/actions/rp";
import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/rp-table/columns";
import { RpTable } from "@/components/tables/rp-table/rp-table";
import { type TParamsProps } from "@/lib/types";
import { canAccessPage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

const breadcrumbItems = [{ title: "RP", link: "/dashboard/rp" }];

export default async function Page(props: TParamsProps) {
  const aUser = await currentUser();
  canAccessPage(aUser, "rp");
  const searchParams = props.searchParams;

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const type = searchParams.type || undefined;
  const shift = searchParams.shift || undefined;
  const to = (searchParams.to as string) || undefined;
  const from = (searchParams.from as string) || undefined;
  const offset = (page - 1) * pageLimit;

  const { data, total } = await getRpList(
    !!type ? Number(type) : 0,
    shift,
    from,
    to,
    offset,
    pageLimit
  );

  const pageCount = Math.ceil(total / pageLimit);
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <RpTable
        data={data as any}
        from={from}
        columns={columns}
        to={to}
        pageNo={page}
        searchKey="poNumber"
        total={total}
        loading={false}
        pageCount={pageCount}
      />
    </div>
  );
}
