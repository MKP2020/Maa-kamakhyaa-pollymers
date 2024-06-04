import BreadCrumb from "@/components/breadcrumb";

import { columns } from "@/components/tables/tarpaulin-table/columns";
import { TarpaulinTable } from "@/components/tables/tarpaulin-table/tarpaulin-table";

const breadcrumbItems = [{ title: "Tarpaulin", link: "/dashboard/tarpaulin" }];

export default async function Page() {
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <TarpaulinTable
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
