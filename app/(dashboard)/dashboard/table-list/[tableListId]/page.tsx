import { getCategories } from "@/actions/category";
import BreadCrumb from "@/components/breadcrumb";
import { CreateTableListForm } from "@/components/forms/create-table-list-form";
// import { ProductForm } from "@/components/forms/product-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const breadcrumbItems = [
  { title: "Table List", link: "/dashboard/table-list" },
  { title: "Create", link: "/dashboard/table-list/new" },
];

type paramsProps = {
  params: {
    [key: string]: string;
  };
};

export default async function Page(props: paramsProps) {
  const { params } = props;

  const tableListId = params?.id !== "new" ? params?.id : undefined;

  const { data } = await getCategories(0, 100);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CreateTableListForm categories={data} />
      </div>
    </ScrollArea>
  );
}
