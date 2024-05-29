import BreadCrumb from "@/components/breadcrumb";

const breadcrumbItems = [
  { title: "RP", link: "/dashboard/rp" },
  { title: "New", link: "/dashboard/new" },
];

export default function Page() {
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
    </div>
  );
}
