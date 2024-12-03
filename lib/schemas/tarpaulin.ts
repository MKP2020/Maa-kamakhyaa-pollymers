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
import {
  doublePrecision,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import type { TGrade } from "../types";
import { grades } from "./grades";
import { relations } from "drizzle-orm";

export const tarpaulin = pgTable(
  "tarpaulin",
  {
    id: serial("id").primaryKey().notNull(),
    date: timestamp("date").defaultNow().notNull(),
    shift: varchar("shift", { length: 1 }).notNull(),
    lamFabricGradeId: integer("lamFabricGradeId")
      .references(() => grades.id)
      .notNull(),
    lamFabricQty: doublePrecision("lamFabricQty").notNull(),
    tarpaulinGradeId: integer("tarpaulinGradeId")
      .references(() => grades.id)
      .notNull(),
    tarpaulinQty: doublePrecision("tarpaulinQty").notNull(),
    tarpaulinSize: text("tarpaulinSize").notNull(),
    tarpWaste: doublePrecision("tarpWaste").notNull(),
  },
  (item) => ({
    tarpShiftIdx: index("tarpShiftIdx").on(item.shift),
    tarpDateIdx: index("tarpDateIdx").on(item.date),
  })
);

export const tarpaulinItem = pgTable(
  "tarpaulinItem",
  {
    id: serial("id").primaryKey().notNull(),

    tarpId: integer("tarpId")
      .notNull()
      .references(() => tarpaulin.id),
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
    quantity: doublePrecision("quantity").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (item) => ({
    tarpItemsIdIdx: index("tarpItemsIdIdx").on(item.tarpId),
    tarpItemsCategoryIdx: index("tarpItemsCategoryIdx").on(item.categoryId),
    tarpItemsDepartmentIdx: index("tarpItemsDepartmentIdx").on(
      item.departmentId
    ),
  })
);

export const tarpaulinItemRelations = relations(tarpaulinItem, ({ one }) => ({
  lamination: one(tarpaulin, {
    fields: [tarpaulinItem.tarpId],
    references: [tarpaulin.id],
  }),
  department: one(departments, {
    fields: [tarpaulinItem.departmentId],
    references: [departments.id],
  }),
  category: one(categories, {
    fields: [tarpaulinItem.categoryId],
    references: [categories.id],
  }),
  inventory: one(inventory, {
    fields: [tarpaulinItem.inventoryId],
    references: [inventory.id],
  }),
  item: one(tableList, {
    fields: [tarpaulinItem.itemId],
    references: [tableList.id],
  }),
}));

export const tarpaulinRelation = relations(tarpaulin, ({ many, one }) => ({
  items: many(tarpaulinItem),
  lamFabricGrade: one(grades, {
    fields: [tarpaulin.lamFabricGradeId],
    references: [grades.id],
  }),
  tarpaulinGrade: one(grades, {
    fields: [tarpaulin.tarpaulinGradeId],
    references: [grades.id],
  }),
}));

export type TTarpaulin = typeof tarpaulin.$inferSelect;

export type TNewTarpaulin = typeof tarpaulin.$inferInsert;

export type TTarpaulinItem = typeof tarpaulinItem.$inferSelect;

export type TTarpaulinItemFull = TTarpaulinItem & {
  department: TDepartment;
  category: TCategory;
  inventory: TInventory;
  item: TTableList;
};

export type TNewTarpaulinItem = typeof tarpaulinItem.$inferInsert;

export type TTarpaulinFull = TTarpaulin & {
  items: TTarpaulinItemFull[];
  lamFabricGrade: TGrade;
  tarpaulinGrade: TGrade;
};
