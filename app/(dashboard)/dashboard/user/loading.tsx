import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/employee-tables/columns";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const breadcrumbItems = [{ title: "User", link: "/dashboard/user" }];

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <div className="flex items-start justify-between">
          <Heading
            title={`Users`}
            description="Manage users (Client side table functionalities.)"
          />
        </div>
        <Separator />
        <DataTable searchKey="name" loading columns={columns} data={[]} />
      </>
    </div>
  );
}
