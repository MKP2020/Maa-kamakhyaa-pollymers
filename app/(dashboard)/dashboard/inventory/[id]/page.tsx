import { getCategories } from "@/actions/category";
import { getDepartments } from "@/actions/department";
import { getInventoryById } from "@/actions/inventory";
import BreadCrumb from "@/components/breadcrumb";
import { CreateInventoryForm } from "@/components/forms/create-inventory-form";
import { ScrollArea } from "@/components/ui/scroll-area";

type paramsProps = {
  params: {
    [key: string]: string | string[] | undefined;
  };
};

const getBreadcrumbItems = (id?: string) => [
  { title: "Inventory", link: "/dashboard/inventory" },

  {
    title: !!id ? "Update" : "New",
    link: !!id ? `/dashboard/inventory/${id}` : "/dashboard/inventory/new",
  },
];

export default async function Page({ params }: paramsProps) {
  const id = params.id === "new" ? undefined : (params.id as string);

  const breadcrumbItems = getBreadcrumbItems(id);

  const initialData = !!id ? await getInventoryById(Number(id)) : undefined;

  const { data: categories } = !!initialData
    ? { data: [initialData.category] }
    : await getCategories();

  const { data: departments } = !!initialData
    ? { data: [initialData.department] }
    : await getDepartments();

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CreateInventoryForm
          departments={departments}
          categories={categories}
          initialData={initialData as any}
        />
      </div>
    </ScrollArea>
  );
}
