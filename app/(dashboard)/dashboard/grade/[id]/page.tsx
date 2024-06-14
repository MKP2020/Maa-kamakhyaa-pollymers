import { getGradeById } from "@/actions/grade";
import BreadCrumb from "@/components/breadcrumb";
import { CreateGradeForm } from "@/components/forms/create-grade-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { canAccessPage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

const breadcrumbItems = [
  { title: "Fabric", link: "/dashboard/grade" },
  { title: "New Fabric", link: "/dashboard/grade/new" },
];

type paramsProps = {
  params: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page(props: paramsProps) {
  const aUser = await currentUser();

  canAccessPage(aUser, "grade");

  const { params } = props;

  const departmentId = params?.id !== "new" ? params?.id : undefined;

  const { data } = !!departmentId
    ? await getGradeById(Number(departmentId as any))
    : { data: null };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CreateGradeForm initialData={data} />
      </div>
    </ScrollArea>
  );
}
