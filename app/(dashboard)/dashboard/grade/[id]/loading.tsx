import BreadCrumb from "@/components/breadcrumb";

const breadcrumbItems = [
  { title: "Fabric", link: "/dashboard/grade" },
  { title: "New Fabric", link: "/dashboard/grade/new" },
];

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
    </div>
  );
}
