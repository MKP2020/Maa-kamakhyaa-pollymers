import { getCategories } from "@/actions/category";
import { getDepartments } from "@/actions/department";
import { getGradesByType, getGradesByTypeWithQuantity } from "@/actions/grade";
import { getLamById } from "@/actions/lam";
import { getLoomById } from "@/actions/loom";
import BreadCrumb from "@/components/breadcrumb";
import { CreateLoomForm } from "@/components/forms/create-lam-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TParamsProps } from "@/lib/types";
import { GRADES_TYPES } from "@/lib/utils";

const getBreadcrumbItems = (id?: string) => [
  { title: "Loom", link: "/dashboard/loom" },

  {
    title: !!id ? "Update" : "New",
    link: !!id ? `/dashboard/loom/${id}` : "/dashboard/loom/new",
  },
];

export default async function Page({ params }: TParamsProps) {
  const id = params?.id === "new" ? undefined : (params?.id as string);

  const breadcrumbItems = getBreadcrumbItems(id);

  const initialData = isNaN(Number(id))
    ? undefined
    : await getLamById(Number(id));

  const { data: categories } = await getCategories();
  const { data: departments } = await getDepartments();

  const { data: fabricGrades } = await getGradesByTypeWithQuantity(
    GRADES_TYPES.Fabric
  );

  const { data: laminatedFabricGrades } = await getGradesByType(
    GRADES_TYPES.LaminatedFabric
  );

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CreateLoomForm
          initialData={initialData}
          categories={categories}
          departments={departments}
          fabricGrades={fabricGrades}
          laminatedFabricGrades={laminatedFabricGrades}
        />
      </div>
    </ScrollArea>
  );
}
