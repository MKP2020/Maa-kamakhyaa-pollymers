import { getUserById } from "@/actions/users";
import BreadCrumb from "@/components/breadcrumb";
import { CreateUserForm } from "@/components/forms/create-user-form";
// import { ProductForm } from "@/components/forms/product-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const breadcrumbItems = [
  { title: "User", link: "/dashboard/user" },
  { title: "Create", link: "/dashboard/user/create" },
];

export default async function Page({ params }: any) {
  const userId = params?.userId !== "new" ? params?.userId : undefined;

  const user = !!userId ? await getUserById(userId) : undefined;

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <CreateUserForm initialData={user} />
        {/* <ProductForm
          categories={[
            { _id: "shirts", name: "shirts" },
            { _id: "pants", name: "pants" },
          ]}
          initialData={null}
          key={null}
        /> */}
      </div>
    </ScrollArea>
  );
}
