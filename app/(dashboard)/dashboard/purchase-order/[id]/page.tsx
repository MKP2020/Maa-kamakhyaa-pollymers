import { getPurchaseOrderById } from "@/actions/purchaseOrder";

type paramsProps = {
  params: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ params }: paramsProps) {
  const id = params.id === "new" ? undefined : params.id;

  const purchaseOrder = !!id
    ? await getPurchaseOrderById(Number(id))
    : undefined;

  return <>{JSON.stringify(purchaseOrder)}</>;
}
