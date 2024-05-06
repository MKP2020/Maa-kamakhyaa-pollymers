import { getFabricById } from "@/actions/fabric";
import BreadCrumb from "@/components/breadcrumb";
import { CreateFabricForm } from "@/components/forms/create-fabric-form";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [
  { title: "Fabric", link: "/dashboard/fabric" },
  { title: "New Fabric", link: "/dashboard/fabric/new" },
];

type paramsProps = {
  params: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page(props: paramsProps) {
  const { params } = props;

  const departmentId = params?.id !== "new" ? params?.id : undefined;

  const { data } = !!departmentId
    ? await getFabricById(Number(departmentId as any))
    : { data: null };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CreateFabricForm initialData={data} />
      </div>
    </ScrollArea>
  );
}
