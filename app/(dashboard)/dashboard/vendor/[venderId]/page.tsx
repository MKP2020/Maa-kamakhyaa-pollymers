import { getCategories } from "@/actions/category";
import { getVendorById } from "@/actions/vendor";
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

type paramsProps = {
  params: {
    [key: string]: string;
  };
};

export default async function Page(props: paramsProps) {
  const { params } = props;
  console.log("searchParams", params?.venderId);
  const vendorId = params?.venderId !== "new" ? params?.venderId : undefined;
  const isUpdate = vendorId !== "new";
  const vendorDetails = !!vendorId
    ? await getVendorById(Number(vendorId))
    : undefined;

  const { data } = await getCategories(0, 100);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CreteVendorForm categories={data} initialData={vendorDetails} />
      </div>
    </ScrollArea>
  );
}
