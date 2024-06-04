import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { grades } from "./grades";
import {
  TCategory,
  TDepartment,
  TInventory,
  TTableList,
  categories,
  departments,
  inventory,
  tableList,
} from "../schema";
import { relations } from "drizzle-orm";
import { TGrade } from "../types";

export const loom = pgTable(
  "loom",
  {
    id: serial("id").primaryKey().notNull(),
    date: timestamp("date").defaultNow().notNull(),
    shift: varchar("shift", { length: 1 }).notNull(),

    tapeGradeId: integer("tapeGradeId")
      .references(() => grades.id)
      .notNull(),
    tapeQty: integer("tapeQty").notNull(),
    fabricGradeId: integer("fabricGradeId")
      .references(() => grades.id)
      .notNull(),
    fabricQty: integer("fabricQty").notNull(),
    loomWaste: integer("loomWaste").notNull(),
  },
  (item) => ({
    loomShiftIdx: index("loomShiftIdx").on(item.shift),
    loomDateIdx: index("loomDateIdx").on(item.date),
  })
);

export const loomItem = pgTable(
  "loomItem",
  {
    id: serial("id").primaryKey().notNull(),

    loomId: integer("loomId")
      .notNull()
      .references(() => loom.id),
    categoryId: integer("categoryId")
      .notNull()
      .references(() => categories.id),
    departmentId: integer("departmentId")
      .notNull()
      .references(() => departments.id),
    inventoryId: integer("inventoryId")
      .notNull()
      .references(() => inventory.id),
    itemId: integer("itemId")
      .notNull()
      .references(() => tableList.id),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (item) => ({
    loomItemsIdIdx: index("loomItemsIdIdx").on(item.loomId),
    loomItemsCategoryIdx: index("loomItemsCategoryIdx").on(item.categoryId),
    loomItemsDepartmentIdx: index("loomItemsDepartmentIdx").on(
      item.departmentId
    ),
  })
);

export const loomItemRelations = relations(loomItem, ({ one }) => ({
  loom: one(loom, {
    fields: [loomItem.loomId],
    references: [loom.id],
  }),
  department: one(departments, {
    fields: [loomItem.departmentId],
    references: [departments.id],
  }),
  category: one(categories, {
    fields: [loomItem.categoryId],
    references: [categories.id],
  }),
  inventory: one(inventory, {
    fields: [loomItem.inventoryId],
    references: [inventory.id],
  }),
  item: one(tableList, {
    fields: [loomItem.itemId],
    references: [tableList.id],
  }),
}));

export const loomRelation = relations(loom, ({ many, one }) => ({
  items: many(loomItem),
  tapeGrade: one(grades, {
    fields: [loom.tapeGradeId],
    references: [grades.id],
  }),
  fabricGrade: one(grades, {
    fields: [loom.fabricGradeId],
    references: [grades.id],
  }),
}));

export type TLoom = typeof loom.$inferSelect;

export type TNewLoom = typeof loom.$inferInsert;

export type TLoomItem = typeof loomItem.$inferSelect;

export type TLoomItemFull = TLoomItem & {
  department: TDepartment;
  category: TCategory;
  inventory: TInventory;
  item: TTableList;
};

export type TNewLoomItem = typeof loomItem.$inferInsert;

export type TLoomFull = TLoom & {
  items: TLoomItemFull[];
  tapeGrade: TGrade;
  fabricGrade: TGrade;
};
