import { getCategories } from "@/actions/category";
import BreadCrumb from "@/components/breadcrumb";
import { CreateUserForm } from "@/components/forms/create-user-form";
import { CreteVendorForm } from "@/components/forms/create-vendor-form";
// import { ProductForm } from "@/components/forms/product-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const breadcrumbItems = [
  { title: "User", link: "/dashboard/user" },
  { title: "Create", link: "/dashboard/user/create" },
];

export default async function Page() {
  const { data } = await getCategories(0, 100);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CreteVendorForm categories={data} initialData={null} />
      </div>
    </ScrollArea>
  );
}
