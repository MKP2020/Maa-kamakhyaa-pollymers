import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/grade-table/columns";
import { GradeTable } from "@/components/tables/grade-table/grade-table";

const breadcrumbItems = [{ title: "Fabric", link: "/dashboard/fabric" }];

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <GradeTable
        pageNo={1}
        total={0}
        pageCount={0}
        searchKey="grade"
        loading
        columns={columns as any}
        data={[]}
      />
    </div>
  );
}
