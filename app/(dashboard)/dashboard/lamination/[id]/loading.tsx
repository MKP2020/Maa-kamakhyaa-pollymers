import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TParamsProps } from "@/lib/types";

const breadcrumbItems = [
  { title: "Loom", link: "/dashboard/loom" },
  {
    title: "New",
    link: "/dashboard/loom/new",
  },
];

export default async function Page({ params }: TParamsProps) {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
    </ScrollArea>
  );
}
