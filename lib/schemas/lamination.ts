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
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { TGrade } from "../types";
import { grades } from "./grades";
import { relations } from "drizzle-orm";

export const lamination = pgTable(
  "lamination",
  {
    id: serial("id").primaryKey().notNull(),
    date: timestamp("date").defaultNow().notNull(),
    shift: varchar("shift", { length: 1 }).notNull(),

    fabricGradeId: integer("fabricGradeId")
      .references(() => grades.id)
      .notNull(),
    fabricQty: doublePrecision("fabricQty").notNull(),

    lamFabricGradeId: integer("lamFabricGradeId")
      .references(() => grades.id)
      .notNull(),
    lamFabricQty: doublePrecision("lamFabricQty").notNull(),
    lamWaste: doublePrecision("lamWaste").notNull(),
  },
  (item) => ({
    lamShiftIdx: index("lamShiftIdx").on(item.shift),
    lamDateIdx: index("lamDateIdx").on(item.date),
  })
);

export const lamItem = pgTable(
  "lamItem",
  {
    id: serial("id").primaryKey().notNull(),

    lamId: integer("lamId")
      .notNull()
      .references(() => lamination.id),
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
    lamItemsIdIdx: index("lamItemsIdIdx").on(item.lamId),
    lamItemsCategoryIdx: index("lamItemsCategoryIdx").on(item.categoryId),
    lamItemsDepartmentIdx: index("lamItemsDepartmentIdx").on(item.departmentId),
  })
);

export const lamItemRelations = relations(lamItem, ({ one }) => ({
  lamination: one(lamination, {
    fields: [lamItem.lamId],
    references: [lamination.id],
  }),
  department: one(departments, {
    fields: [lamItem.departmentId],
    references: [departments.id],
  }),
  category: one(categories, {
    fields: [lamItem.categoryId],
    references: [categories.id],
  }),
  inventory: one(inventory, {
    fields: [lamItem.inventoryId],
    references: [inventory.id],
  }),
  item: one(tableList, {
    fields: [lamItem.itemId],
    references: [tableList.id],
  }),
}));

export const laminationRelation = relations(lamination, ({ many, one }) => ({
  items: many(lamItem),
  fabricGrade: one(grades, {
    fields: [lamination.fabricGradeId],
    references: [grades.id],
  }),
  lamFabricGrade: one(grades, {
    fields: [lamination.lamFabricGradeId],
    references: [grades.id],
  }),
}));

export type TLam = typeof lamination.$inferSelect;

export type TNewLam = typeof lamination.$inferInsert;

export type TLamItem = typeof lamItem.$inferSelect;

export type TLamItemFull = TLamItem & {
  department: TDepartment;
  category: TCategory;
  inventory: TInventory;
  item: TTableList;
};

export type TNewLamItem = typeof lamItem.$inferInsert;

export type TLamFull = TLam & {
  items: TLamItemFull[];
  lamFabricGrade: TGrade;
  fabricGrade: TGrade;
};
