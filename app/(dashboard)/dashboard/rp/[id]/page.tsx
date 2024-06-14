import { getCategories } from "@/actions/category";
import { getDepartments } from "@/actions/department";
import { getRpById } from "@/actions/rp";
import BreadCrumb from "@/components/breadcrumb";
import { CreateRP } from "@/components/forms/create-rp-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TParamsProps } from "@/lib/types";
import { canAccessPage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

const breadcrumbItems = [
  { title: "RP", link: "/dashboard/rp" },
  { title: "New", link: "/dashboard/new" },
];

export default async function Page(props: TParamsProps) {
  const aUser = await currentUser();
  canAccessPage(aUser, "rp");
  const { id } = props.params;

  const initialData =
    !!id && id !== "new" ? await getRpById(Number(id)) : undefined;

  const { data: categories } = await getCategories();
  const { data: departments } = await getDepartments();
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <CreateRP
          initialData={initialData}
          categories={categories}
          departments={departments}
        />
      </div>
    </ScrollArea>
  );
}
