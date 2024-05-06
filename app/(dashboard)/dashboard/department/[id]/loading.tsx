import BreadCrumb from "@/components/breadcrumb";

const breadcrumbItems = [
  { title: "Add Department", link: "/dashboard/department/new" },
  { title: "Departments", link: "/dashboard/department" },
];

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
    </div>
  );
}
