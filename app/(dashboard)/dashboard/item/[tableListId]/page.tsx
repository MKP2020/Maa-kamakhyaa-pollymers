import { getCategories } from "@/actions/category";
import BreadCrumb from "@/components/breadcrumb";
import { CreateTableListForm } from "@/components/forms/create-table-list-form";
// import { ProductForm } from "@/components/forms/product-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { canAccessPage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

// sds
const breadcrumbItems = [
  { title: "Item", link: "/dashboard/item" },
  { title: "New Item", link: "/dashboard/item/new" },
];

type paramsProps = {
  params: {
    [key: string]: string;
  };
};

export default async function Page(props: paramsProps) {
  const aUser = await currentUser();

  canAccessPage(aUser, "table-list");

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
