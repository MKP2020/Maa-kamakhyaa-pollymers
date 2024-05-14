import { getIndentById, getIndents } from "@/actions/indent";
import { getPurchaseOrderById } from "@/actions/purchaseOrder";
import { getVendors, getVendorsByType } from "@/actions/vendor";
import BreadCrumb from "@/components/breadcrumb";
import { CreatePurchaseOrder } from "@/components/forms/create-purchase-order-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TIndent, TPurchaseOrder } from "@/lib/types";

type paramsProps = {
  params: {
    [key: string]: string | string[] | undefined;
  };
};

const getBreadcrumbItems = (id?: string) => [
  { title: "Purchase Order", link: "/dashboard/purchase-order" },

  {
    title: !!id ? "Update" : "New",
    link: !!id
      ? `/dashboard/purchase-order]/${id}`
      : "/dashboard/purchase-order/new",
  },
];

export default async function Page({ params }: paramsProps) {
  const id = params.id === "new" ? undefined : (params.id as string);

  const breadcrumbItems = getBreadcrumbItems(id);

  const purchaseOrder = !!id
    ? await getPurchaseOrderById(Number(id))
    : undefined;

  const vendors = await getVendorsByType(0);
  const { data: indents } = id ? { data: [] } : await getIndents();
  const pIndent = !!id
    ? !purchaseOrder
      ? undefined
      : await getIndentById(purchaseOrder.indentId)
    : undefined;
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CreatePurchaseOrder
          initialData={purchaseOrder as TPurchaseOrder}
          indents={!!id ? (!pIndent ? [] : [pIndent]) : indents}
          vendors={vendors}
        />
      </div>
    </ScrollArea>
  );
}
