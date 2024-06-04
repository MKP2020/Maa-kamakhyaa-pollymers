import { getAllUsers } from "@/actions/users";
import BreadCrumb from "@/components/breadcrumb";
import { UserClient } from "@/components/tables/user-tables/client";

const breadcrumbItems = [{ title: "User", link: "/dashboard/user" }];

export default async function page() {
  // const userResponse = await fetch("http://localhost:3000/api/users", {
  //   next: { revalidate: 10 },
  // });
  const data = await getAllUsers();

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <UserClient data={data} />
      </div>
    </>
  );
}
