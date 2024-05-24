import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb
          items={[{ title: "Inventory", link: "/dashboard/inventory" }]}
        />
      </div>
    </ScrollArea>
  );
}
