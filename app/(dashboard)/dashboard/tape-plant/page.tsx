import BreadCrumb from "@/components/breadcrumb";
import { TapePlantTable } from "@/components/tables/tape-plant-table/tape-plant-table";
import { columns } from "@/components/tables/tape-plant-table/columns";
import { getTapePlantList } from "@/actions/tapePlant";
import { currentUser } from "@clerk/nextjs/server";
import { canAccessPage } from "@/lib/utils";

const breadcrumbItems = [
  { title: "Tape Plant", link: "/dashboard/tape-plant" },
];

type paramsProps = {
  searchParams: {
    [key: string]: string | undefined;
  };
};

export default async function Page({ searchParams }: paramsProps) {
  const aUser = await currentUser();
  canAccessPage(aUser, "tape-plant");

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;

  const shift = searchParams.shift;
  const offset = (page - 1) * pageLimit;
  const from = searchParams.from || undefined;
  const to = searchParams.to || undefined;

  const { data, total } = await getTapePlantList(shift, from, to, offset);

  const pageCount = Math.ceil(total / pageLimit);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <TapePlantTable
          from={from}
          to={to}
          pageCount={pageCount}
          total={total}
          pageNo={page}
          searchKey="name"
          columns={columns}
          data={data}
        />
      </div>
    </>
  );
}
