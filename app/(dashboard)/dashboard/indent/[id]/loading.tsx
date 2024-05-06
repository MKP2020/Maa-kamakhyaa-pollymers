import { getCategories } from "@/actions/category";
import { getDepartments } from "@/actions/department";
import { getIndentById, getIndents } from "@/actions/indent";
import BreadCrumb from "@/components/breadcrumb";
import { CreateIndentForm } from "@/components/forms/create-indent-form";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export default async function (props: paramsProps) {
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
