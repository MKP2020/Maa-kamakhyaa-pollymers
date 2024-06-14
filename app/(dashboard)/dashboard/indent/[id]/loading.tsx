import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { currentUser } from "@clerk/nextjs/server";

const getBreadcrumbItems = (id?: string) => [
  { title: "Indent", link: "/dashboard/indent" },

  {
    title: !!id ? "Update" : "New",
    link: !!id ? `/dashboard/indent/${id}` : "/dashboard/indent/new",
  },
];

type paramsProps = {
  params: {
    [key: string]: string | undefined;
  };
};

export default async function Page(props: paramsProps) {
  const indentId = props.params?.id !== "new" ? props.params?.id : undefined;

  const breadcrumbItems = getBreadcrumbItems(indentId);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
    </ScrollArea>
  );
}
