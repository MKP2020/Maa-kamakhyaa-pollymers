import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/loom-table/columns";
import { LamTable } from "@/components/tables/lam-table/lam-table";

const breadcrumbItems = [{ title: "Loom", link: "/dashboard/loom" }];

export default async function Page() {
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <LamTable
        from={""}
        to={""}
        loading
        pageCount={0}
        total={0}
        pageNo={0}
        searchKey="name"
        columns={columns}
        data={[]}
      />
    </div>
  );
}
