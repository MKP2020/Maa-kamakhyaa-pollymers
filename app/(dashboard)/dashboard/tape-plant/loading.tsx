import BreadCrumb from "@/components/breadcrumb";
import { TapePlantTable } from "@/components/tables/tape-plant-table/tape-plant-table";
import { columns } from "@/components/tables/tape-plant-table/columns";

const breadcrumbItems = [
  { title: "Tape Plant", link: "/dashboard/tape-plant" },
];

export default async function Page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <TapePlantTable
          from={""}
          to={""}
          loading
          pageCount={0}
          total={0}
          pageNo={0}
          searchKey="name"
          columns={columns}
          data={[]}
        />
      </div>
    </>
  );
}
