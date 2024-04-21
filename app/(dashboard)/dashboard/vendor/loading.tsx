import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/vendors-tables/columns";
import { VendorTable } from "@/components/tables/vendors-tables/vendors-table";

const breadcrumbItems = [{ title: "Category", link: "/dashboard/vendor" }];

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <VendorTable
        pageCount={0}
        total={0}
        loading
        pageNo={0}
        searchKey="name"
        columns={columns}
        data={[]}
      />
    </div>
  );
}
