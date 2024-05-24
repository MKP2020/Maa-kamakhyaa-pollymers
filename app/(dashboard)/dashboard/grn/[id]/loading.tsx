import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";

const getBreadcrumbItems = (id?: string) => [
  { title: "GRN", link: "/dashboard/grn" },

  {
    title: !!id ? "Update" : "New",
    link: !!id ? `/dashboard/grn/${id}` : "/dashboard/grn/new",
  },
];

export default function Page() {
  const breadcrumbItems = getBreadcrumbItems(undefined);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
    </ScrollArea>
  );
}
