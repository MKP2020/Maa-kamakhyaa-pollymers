import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/rp-table/columns";
import { RpTable } from "@/components/tables/rp-table/rp-table";

const breadcrumbItems = [{ title: "RP", link: "/dashboard/rp" }];

export default function Page() {
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <RpTable
        data={[]}
        from={new Date().toString()}
        columns={columns}
        to={""}
        pageNo={0}
        searchKey="poNumber"
        total={0}
        loading
        pageCount={0}
      />
    </div>
  );
}
