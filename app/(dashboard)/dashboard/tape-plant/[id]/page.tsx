import { getCategories } from "@/actions/category";
import { getDepartments } from "@/actions/department";
import { getGradesByType } from "@/actions/grade";
import { getQuantitiesByIds } from "@/actions/quantity";
import { getTapePlantById } from "@/actions/tapePlant";
import BreadCrumb from "@/components/breadcrumb";
import { CreateTapePlantForm } from "@/components/forms/create-tape-plant-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TParamsProps } from "@/lib/types";
import { GRADES_TYPES, GlobalQuantityObj, canAccessPage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

const breadcrumbItems = [];

const getBreadcrumbItems = (id?: string) => [
  { title: "Tape Plant", link: "/dashboard/tape-plant" },

  {
    title: !!id ? "View/Update" : "New",
    link: !!id ? `/dashboard/tape-plant/${id}` : "/dashboard/tape-plant/new",
  },
];

export default async function Page(props: TParamsProps) {
  const aUser = await currentUser();
  canAccessPage(aUser, "tape-plant");
  const id = !!props.params?.id
    ? props.params.id === "new"
      ? undefined
      : props.params.id
    : undefined;

  const isId = !!id ? !isNaN(Number(id)) : false;
  const initialData = isId ? await getTapePlantById(Number(id)) : undefined;

  const response = isId
    ? []
    : await getQuantitiesByIds([
        GlobalQuantityObj.RP_Mix_1st,
        GlobalQuantityObj.RP_Mix_2nd,
        GlobalQuantityObj["RP_Black(Lam)_1st"],
        GlobalQuantityObj["RP_Black(Lam)_2nd"],
        GlobalQuantityObj["RP_Black(Tape)_1st"],
        GlobalQuantityObj["RP_Black(Tape)_2nd"],
      ]);

  const { data: categories } = await getCategories();
  const { data: departments } = await getDepartments();

  const map: Record<number, number> = {};
  for (let index = 0; index < response.length; index++) {
    const element = response[index];
    map[element.id] = element.producedQty - element.usedQty;
  }

  const { data: tapeGrades } = await getGradesByType(GRADES_TYPES.Tape);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={getBreadcrumbItems(id)} />
        <CreateTapePlantForm
          initialData={initialData as any}
          departments={departments}
          categories={categories}
          rpQuantities={map}
          grades={tapeGrades}
        />
      </div>
    </ScrollArea>
  );
}
