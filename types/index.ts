import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  access: number[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export type TInventoryAggregated = {
  id: number;
  itemId: number;
  item: {
    id: number;
    name: string;
    minQuantity: number;
    unit: string;
    categoryId: number;
    createdAt: Date;
  };
  category: {
    id: number;
    name: string;
    createdAt: Date;
  };
  department: {
    id: number;
    name: string;
    createdAt: Date;
  };
  poItemId: number;
  grnId: number;
  // Individual record quantities
  inStockQuantity: number;
  usedQuantity: number;
  // Total quantities for the item (combined from all records)
  totalInStock: number;
  totalUsed: number;
  availableQuantity: number;
  inventoryCount: number;
  createdAt: Date;
  updatedAt: Date;
};
