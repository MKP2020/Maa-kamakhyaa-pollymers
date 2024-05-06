import { getDepartmentById } from "@/actions/department";
import BreadCrumb from "@/components/breadcrumb";
import { CreateDepartmentForm } from "@/components/forms/create-department-form";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [
  { title: "Department", link: "/dashboard/department" },
  { title: "New Department", link: "/dashboard/department/new" },
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
    ? await getDepartmentById(Number(departmentId as any))
    : { data: null };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CreateDepartmentForm initialData={data} />
      </div>
    </ScrollArea>
  );
}
