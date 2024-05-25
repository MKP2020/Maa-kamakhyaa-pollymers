import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/washin-unit-table/columns";
import { WashingUnitTable } from "@/components/tables/washin-unit-table/washing-unit-table";

const breadcrumbItems = [
  { title: "Washing Unit", link: "/dashboard/washing-unit" },
];

export default async function Page() {
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />

      <WashingUnitTable
        columns={columns as any}
        data={[]}
        date={null}
        pageNo={0}
        searchKey="id"
        total={0}
        loading
        pageCount={0}
      />
    </div>
  );
}
