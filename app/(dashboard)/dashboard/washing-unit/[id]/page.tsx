import { getCategories } from "@/actions/category";
import { getDepartments } from "@/actions/department";
import { getGrnById } from "@/actions/grn";
import {
  getPendingPurchaseOrders,
  getPurchaseOrderById,
} from "@/actions/purchaseOrder";
import { getWashingUnitById } from "@/actions/washingUnit";
import BreadCrumb from "@/components/breadcrumb";
import { CreateGRN } from "@/components/forms/create-grn-form";
import { CreateWashingUnit } from "@/components/forms/create-washing-unit-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { canAccessPage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

type paramsProps = {
  params: {
    [key: string]: string | string[] | undefined;
  };
};

const getBreadcrumbItems = (id?: string) => [
  { title: "Washing Unit", link: "/dashboard/washing-unit" },

  {
    title: !!id ? "View/Update" : "New",
    link: !!id
      ? `/dashboard/washing-unit/${id}`
      : "/dashboard/washing-unit/new",
  },
];

export default async function Page({ params }: paramsProps) {
  const aUser = await currentUser();
  canAccessPage(aUser, "washing-unit");
  const id = params.id === "new" ? undefined : (params.id as string);

  const breadcrumbItems = getBreadcrumbItems(id);

  const initialData = !id ? undefined : await getWashingUnitById(Number(id));

  const { data: categories } = !!initialData
    ? { data: [] }
    : await getCategories();
  const { data: departments } = !!initialData
    ? { data: [] }
    : await getDepartments();

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CreateWashingUnit
          initialData={initialData as any}
          departments={departments}
          categories={categories}
        />
      </div>
    </ScrollArea>
  );
}
