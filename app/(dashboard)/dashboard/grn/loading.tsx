import BreadCrumb from "@/components/breadcrumb";
import { GRNTable } from "@/components/tables/grn-table/grn-table";
import { columns } from "@/components/tables/grn-table/columns";

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const breadcrumbItems = [{ title: "GRN", link: "/dashboard/grn" }];

export default async function Page({}: paramsProps) {
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <GRNTable
        columns={columns as any}
        data={[]}
        pageNo={0}
        searchKey="poNumber"
        total={0}
        loading
        pageCount={0}
      />
    </div>
  );
}
