import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
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
    categoryId: integer("categoryId").notNull(),
    inStockQuantity: integer("inStockQuantity").notNull(),
    usedQuantity: integer("usedQuantity").default(0).notNull(),
    departmentId: integer("departmentId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
    grnId: integer("grnId").notNull(),
  },
  (inventory) => {
    return {
      itemIdx: index("inventoryItemIdx").on(inventory.itemId),
      dateIdx: index("inventoryDate").on(inventory.createdAt).desc(),
    };
  }
);

export const inventoryRelations = relations(inventory, ({ one }) => ({
  department: one(departments, {
    fields: [inventory.departmentId],
    references: [departments.id],
  }),
  item: one(purchaseOrderItems, {
    fields: [inventory.itemId],
    references: [purchaseOrderItems.id],
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
  item: TPurchaseOrderItemFull;
  category: TCategory;
};

export type TNewInventory = typeof inventory.$inferInsert;
