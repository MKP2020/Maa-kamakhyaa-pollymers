import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { TDepartment, departments } from "./department";
import {
  TCategory,
  TTableList,
  categories,
  grns,
  purchaseOrderItems,
  tableList,
} from "../schema";
import { TPurchaseOrderItemFull } from "../types";

export const inventory = pgTable(
  "inventory",
  {
    id: serial("id").primaryKey().notNull(),
    itemId: integer("itemId").notNull(),
    poItemId: integer("poItemId").notNull(),
    categoryId: integer("categoryId").notNull(),
    inStockQuantity: integer("inStockQuantity").notNull(),
    usedQuantity: integer("usedQuantity").default(0).notNull(),
    departmentId: integer("departmentId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
    grnId: integer("grnId").notNull(),
  },
  (table) => {
    return {
      itemIdx: index("inventoryItemIdx").on(table.itemId),
      poItemIdx: index("poItemIdx").on(table.poItemId),
      dateIdx: index("inventoryDate").on(table.createdAt).desc(),
      categoryIdIdx: index("inventoryCategoryIdIdx").on(table.categoryId),
      departmentIdIdIdx: index("inventoryDepartmentIdIdx").on(
        table.departmentId
      ),
    };
  }
);

export const inventoryRelations = relations(inventory, ({ one }) => ({
  department: one(departments, {
    fields: [inventory.departmentId],
    references: [departments.id],
  }),
  poItem: one(purchaseOrderItems, {
    fields: [inventory.poItemId],
    references: [purchaseOrderItems.id],
  }),
  item: one(tableList, {
    fields: [inventory.itemId],
    references: [tableList.id],
  }),
  category: one(categories, {
    fields: [inventory.categoryId],
    references: [categories.id],
  }),
  grnId: one(grns, {
    fields: [inventory.grnId],
    references: [grns.id],
  }),
}));

export type TInventory = typeof inventory.$inferSelect;

export type TInventoryFull = TInventory & {
  department: TDepartment;
  item: TTableList;
  poItem: TPurchaseOrderItemFull;
  category: TCategory;
};

export type TInventoryOtherFull = {
  inventory: TInventory;
  purchaseOrderItems: TPurchaseOrderItemFull;
  tableList: TTableList;
  departments: TDepartment;
  categories: TCategory;
};

export type TNewInventory = typeof inventory.$inferInsert;
