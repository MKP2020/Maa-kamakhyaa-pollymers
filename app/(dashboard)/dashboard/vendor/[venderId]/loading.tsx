import BreadCrumb from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import React from "react";

const breadcrumbItems = [
  { title: "User", link: "/dashboard/user" },
  { title: "Create", link: "/dashboard/user/create" },
];

const initialData = null;
export default function Page() {
  const title = initialData ? "Edit Vendor" : "Create New Vendor";
  const description = initialData ? "Edit vendor details." : "Add a new vendor";

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between">
          <Heading title={title} description={description} />
          {initialData && (
            <Button variant="destructive" size="sm">
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Separator />
      </div>
    </ScrollArea>
  );
}
