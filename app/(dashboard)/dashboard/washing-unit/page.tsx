import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/washin-unit-table/columns";
import { getWashingUnits } from "@/actions/washingUnit";
import { WashingUnitTable } from "@/components/tables/washin-unit-table/washing-unit-table";
import { canAccessPage, isValidShift } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const breadcrumbItems = [
  { title: "Washing Unit", link: "/dashboard/washing-unit" },
];

export default async function Page({ searchParams }: paramsProps) {
  const aUser = await currentUser();
  canAccessPage(aUser, "washing-unit");
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const shift = (searchParams.shift || undefined) as any;
  const search = searchParams.search || undefined;
  const date = (searchParams.date as string) || undefined;
  const offset = (page - 1) * pageLimit;

  const { data, total } = await getWashingUnits(
    search as any,
    date,
    isValidShift(shift) ? shift : undefined,
    offset,
    pageLimit
  );

  const pageCount = Math.ceil(total / pageLimit);

  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />

      <WashingUnitTable
        columns={columns as any}
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
