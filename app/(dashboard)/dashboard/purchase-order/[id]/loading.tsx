import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";

const getBreadcrumbItems = (id?: string) => [
  { title: "Purchase Order", link: "/dashboard/purchase-order" },

  {
    title: !!id ? "Update" : "New",
    link: !!id
      ? `/dashboard/purchase-order]/${id}`
      : "/dashboard/purchase-order/new",
  },
];

type paramsProps = {
  params: {
    [key: string]: string | string[] | undefined;
  };
};

export default function Page({ params }: paramsProps) {
  console.log("params", params);
  const id = params?.id === "new" ? undefined : (params?.id as string);

  const breadcrumbItems = getBreadcrumbItems(id);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
    </ScrollArea>
  );
}
