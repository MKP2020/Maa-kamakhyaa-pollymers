import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

const breadcrumbItems = [
  { title: "Tape Plant", link: "/dashboard/tape-plant" },
  {
    title: "View/Update",
    link: "/dashboard/tape-plant/new",
  },
];

export default async function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <Loader2 className="animate-spin" />
      </div>
    </ScrollArea>
  );
}
