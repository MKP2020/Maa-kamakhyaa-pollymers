import { getCategories } from "@/actions/category";
import { getDepartments } from "@/actions/department";
import { getGradesByType, getGradesByTypeWithQuantity } from "@/actions/grade";
import { getTarpaulinById } from "@/actions/tarpaulin";
import BreadCrumb from "@/components/breadcrumb";
import { CreateTarpaulinForm } from "@/components/forms/create-tarpaulin-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TParamsProps } from "@/lib/types";
import { GRADES_TYPES, canAccessPage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

const getBreadcrumbItems = (id?: string) => [
  { title: "Tarpaulin", link: "/dashboard/tarpaulin" },
  {
    title: !!id ? "Update" : "New",
    link: !!id ? `/dashboard/tarpaulin/${id}` : "/dashboard/tarpaulin/new",
  },
];

export default async function Page({ params }: TParamsProps) {
  const aUser = await currentUser();
  canAccessPage(aUser, "tarpaulin");
  const id = params?.id === "new" ? undefined : (params?.id as string);

  const breadcrumbItems = getBreadcrumbItems(id);

  const initialData = isNaN(Number(id))
    ? undefined
    : await getTarpaulinById(Number(id));

  const { data: categories } = await getCategories();
  const { data: departments } = await getDepartments();

  const { data: laminatedFabricGrades } = await getGradesByTypeWithQuantity(
    GRADES_TYPES.LaminatedFabric
  );

  const { data: tarpaulinGrades } = await getGradesByType(
    GRADES_TYPES.Tarpaulin
  );

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CreateTarpaulinForm
          initialData={initialData}
          categories={categories}
          departments={departments}
          laminatedFabricGrades={laminatedFabricGrades}
          tarpaulinGrades={tarpaulinGrades}
        />
      </div>
    </ScrollArea>
  );
}
