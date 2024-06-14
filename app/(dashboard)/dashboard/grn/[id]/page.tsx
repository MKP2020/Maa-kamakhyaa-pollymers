import { getGrnById } from "@/actions/grn";
import {
  getPendingPurchaseOrders,
  getPurchaseOrderById,
} from "@/actions/purchaseOrder";
import BreadCrumb from "@/components/breadcrumb";
import { CreateGRN } from "@/components/forms/create-grn-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { canAccessPage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

type paramsProps = {
  params: {
    [key: string]: string | string[] | undefined;
  };
};

const getBreadcrumbItems = (id?: string) => [
  { title: "GRN", link: "/dashboard/grn" },

  {
    title: !!id ? "Update" : "New",
    link: !!id ? `/dashboard/grn/${id}` : "/dashboard/grn/new",
  },
];

export default async function Page({ params }: paramsProps) {
  const aUser = await currentUser();

  canAccessPage(aUser, "grn");

  const id = params.id === "new" ? undefined : (params.id as string);

  const breadcrumbItems = getBreadcrumbItems(id);

  const initialData = !id ? undefined : await getGrnById(Number(id));

  const purchaseOrders = !id
    ? await getPendingPurchaseOrders()
    : [await getPurchaseOrderById(initialData!.poId)];

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CreateGRN
          initialData={initialData as any}
          purchaseOrders={purchaseOrders as any}
        />
      </div>
    </ScrollArea>
  );
}
