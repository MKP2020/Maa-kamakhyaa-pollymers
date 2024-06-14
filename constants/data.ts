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
    access: [0, 1],
  },
  {
    title: "User",
    href: "/dashboard/user",
    icon: "user",
    label: "user",
    access: [0, 1],
  },
  {
    title: "Category",
    href: "/dashboard/category",
    icon: "category",
    label: "category",
    access: [0, 1],
  },
  {
    title: "Vendor",
    href: "/dashboard/vendor",
    icon: "store",
    label: "vendor",
    access: [0, 1],
  },
  {
    title: "Department",
    href: "/dashboard/department",
    icon: "network",
    label: "department",
    access: [0, 1],
  },
  {
    title: "Item",
    href: "/dashboard/item",
    icon: "table",
    label: "vendor",
    access: [0, 1],
  },
  {
    title: "Grade",
    href: "/dashboard/grade",
    icon: "scroll",
    label: "grade",
    access: [0, 1],
  },
  {
    title: "Indent",
    href: "/dashboard/indent",
    icon: "newspaper",
    label: "indent",
    access: [0, 1, 2, 3],
  },
  {
    title: "Purchase Order",
    href: "/dashboard/purchase-order",
    icon: "newspaper",
    label: "purchase-order",
    access: [0, 1, 2, 3],
  },
  {
    title: "GRN",
    href: "/dashboard/grn",
    icon: "newspaper",
    label: "grn",
    access: [0, 1, 2, 3],
  },
  {
    title: "Inventory",
    href: "/dashboard/inventory",
    icon: "boxes",
    label: "inventory",
    access: [0, 1, 2, 3],
  },
  {
    title: "Washing Unit",
    href: "/dashboard/washing-unit",
    icon: "washingMachine",
    label: "washing-unit",
    access: [0, 1, 4],
  },
  {
    title: "RP",
    href: "/dashboard/rp",
    icon: "washingMachine",
    label: "rp",
    access: [0, 1, 4],
  },
  {
    title: "Tape Plant",
    href: "/dashboard/tape-plant",
    icon: "washingMachine",
    label: "tape-plant",
    access: [0, 1, 4],
  },
  {
    title: "Loom",
    href: "/dashboard/loom",
    icon: "washingMachine",
    label: "loom",
    access: [0, 1, 4],
  },
  {
    title: "Lamination",
    href: "/dashboard/lamination",
    icon: "washingMachine",
    label: "lamination",
    access: [0, 1, 4],
  },
  {
    title: "Tarpaulin",
    href: "/dashboard/tarpaulin",
    icon: "washingMachine",
    label: "tarpaulin",
    access: [0, 1, 4],
  },
];
