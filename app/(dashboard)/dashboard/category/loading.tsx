import BreadCrumb from "@/components/breadcrumb";
import { CategoryTable } from "@/components/tables/category-tables/category-table";
import { columns } from "@/components/tables/category-tables/columns";

const breadcrumbItems = [{ title: "User", link: "/dashboard/category" }];

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <CategoryTable
        pageNo={1}
        totalCategories={0}
        pageCount={0}
        searchKey="name"
        loading
        columns={columns}
        data={[]}
      />
    </div>
  );
}
