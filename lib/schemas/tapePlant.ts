import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { grades } from "./grades";
import { relations } from "drizzle-orm";
import {
  TCategory,
  TDepartment,
  TInventory,
  categories,
  departments,
  inventory,
  tableList,
} from "../schema";
import { TGrade, TTableList } from "../types";

export const tapePlant = pgTable(
  "tapePlant",
  {
    id: serial("id").primaryKey().notNull(),
    date: timestamp("date").defaultNow().notNull(),
    shift: varchar("shift", { length: 1 }).notNull(),

    tapeGradeId: integer("tapeGradeId")
      .notNull()
      .references(() => grades.id),
    tapeQty: integer("tapeQty").notNull(),
    tapeWaste: integer("tapeWaste").notNull(),
    tapeLumps: integer("tapeLumps").notNull(),
  },
  (item) => ({
    tapePlantDateIdx: index("tapePlantDateIdx").on(item.date),
    tapePlantShiftIdx: index("tapePlantShiftIdx").on(item.shift),
    tapePlantGradeIdx: index("tapePlantGradeIdx").on(item.tapeGradeId),
  })
);

export const tapePlantConsumedItem = pgTable("tapePlantConsumedItem", {
  id: serial("id").primaryKey().notNull(),
  tapeId: integer("tapeId")
    .notNull()
    .references(() => tapePlant.id),
  rpType: integer("rpType").notNull(),
  qty: integer("qty").notNull(),
});

export const tapePlantConsumedItemRelation = relations(
  tapePlantConsumedItem,
  ({ one }) => ({
    tape: one(tapePlant, {
      fields: [tapePlantConsumedItem.tapeId],
      references: [tapePlant.id],
    }),
  })
);

export const tapeItem = pgTable(
  "tapeItem",
  {
    id: serial("id").primaryKey().notNull(),

    tapeId: integer("tapeId")
      .notNull()
      .references(() => tapePlant.id),
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
    tapeItemsIdIdx: index("tapeItemsIdIdx").on(item.tapeId),
    tapeItemsCategoryIdx: index("tapeItemsCategoryIdx").on(item.categoryId),
    tapeItemsDepartmentIdx: index("tapeItemsDepartmentIdx").on(
      item.departmentId
    ),
  })
);

export const tapePlantItemsRelations = relations(tapeItem, ({ one }) => ({
  rp: one(tapePlant, {
    fields: [tapeItem.tapeId],
    references: [tapePlant.id],
  }),
  department: one(departments, {
    fields: [tapeItem.departmentId],
    references: [departments.id],
  }),
  category: one(categories, {
    fields: [tapeItem.categoryId],
    references: [categories.id],
  }),
  inventory: one(inventory, {
    fields: [tapeItem.inventoryId],
    references: [inventory.id],
  }),
  item: one(tableList, {
    fields: [tapeItem.itemId],
    references: [tableList.id],
  }),
}));

export const tapePlantRelation = relations(tapePlant, ({ many, one }) => ({
  consumedItems: many(tapePlantConsumedItem),
  items: many(tapeItem),
  tapeGrade: one(grades, {
    fields: [tapePlant.tapeGradeId],
    references: [grades.id],
  }),
}));

export type TTape = typeof tapePlant.$inferSelect;

export type TNewTape = typeof tapePlant.$inferInsert;

export type TTapeConsumedItem = typeof tapePlantConsumedItem.$inferSelect;

export type TNewTapeConsumedItem = typeof tapePlantConsumedItem.$inferInsert;

export type TTapeItem = typeof tapeItem.$inferSelect;

export type TTTapeItemFull = TTapeItem & {
  department: TDepartment;
  category: TCategory;
  inventory: TInventory;
  item: TTableList;
};

export type TNewTapeItem = typeof tapeItem.$inferInsert;

export type TTapeFull = TTape & {
  items: TTTapeItemFull[];
  tapeGrade: TGrade;
  consumedItems: TTapeConsumedItem[];
};
