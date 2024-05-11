import { Icons } from "@/components/icons";
import { NavItem, SidebarNavItem } from "@/types";

export type TUser = {
  firstName: string | null;
  lastName: string | null;
  emailAddresses: {
    emailAddress: string;
  }[];
  id: string;
  createdAt: number;
};

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "User",
    href: "/dashboard/user",
    icon: "user",
    label: "user",
  },
  {
    title: "Category",
    href: "/dashboard/category",
    icon: "category",
    label: "category",
  },
  {
    title: "Vendor",
    href: "/dashboard/vendor",
    icon: "store",
    label: "vendor",
  },
  {
    title: "Department",
    href: "/dashboard/department",
    icon: "network",
    label: "department",
  },
  {
    title: "Item",
    href: "/dashboard/item",
    icon: "table",
    label: "vendor",
  },
  {
    title: "Fabric",
    href: "/dashboard/fabric",
    icon: "scroll",
    label: "fabric",
  },
  {
    title: "Indent",
    href: "/dashboard/indent",
    icon: "newspaper",
    label: "indent",
  },
  {
    title: "Purchase Order",
    href: "/dashboard/purchase-order",
    icon: "newspaper",
    label: "indent",
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: "profile",
    label: "profile",
  },
  {
    title: "Kanban",
    href: "/dashboard/kanban",
    icon: "kanban",
    label: "kanban",
  },
  {
    title: "Login",
    href: "/",
    icon: "login",
    label: "login",
  },
];
