import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import {
  TCategory,
  TDepartment,
  TInventory,
  categories,
  departments,
  inventory,
  tableList,
} from "../schema";
import { TTableList } from "../types";

export const washingUnit = pgTable(
  "washingUnit",
  {
    id: serial("id").primaryKey().notNull(),
    date: timestamp("date").defaultNow().notNull(),
    note: text("note").default(""),
    shift: varchar("shift", { length: 1 }).notNull(),
    bhusaQuantity: integer("bhusaQuantity"),
  },
  (consumption) => ({
    consumptionShiftIdx: index("consumptionShiftIdx").on(consumption.shift),
    consumptionDateIdx: index("consumptionDateIdx").on(consumption.date),
  })
);

export const washingUnitItems = pgTable(
  "washingUnitItems",
  {
    id: serial("id").primaryKey().notNull(),
    unitId: integer("unitId")
      .notNull()
      .references(() => washingUnit.id),
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
    reqQty: integer("reqQty").notNull(),
    issueQuantity: integer("issueQuantity").notNull(),
  },
  (washingUnitItems) => ({
    washingUnitItemsUnitIdx: index("washingUnitItemsUnitIdx").on(
      washingUnitItems.unitId
    ),
    washingUnitItemsCategoryIdIdx: index("washingUnitItemsCategoryIdIdx").on(
      washingUnitItems.categoryId
    ),
  })
);

export const washingUnitRelations = relations(washingUnit, ({ many }) => ({
  items: many(washingUnitItems),
}));

export const washingUnitItemsRelations = relations(
  washingUnitItems,
  ({ one }) => ({
    washingUnit: one(washingUnit, {
      fields: [washingUnitItems.unitId],
      references: [washingUnit.id],
    }),
    category: one(categories, {
      fields: [washingUnitItems.categoryId],
      references: [categories.id],
    }),
    department: one(departments, {
      fields: [washingUnitItems.departmentId],
      references: [departments.id],
    }),
    inventory: one(inventory, {
      fields: [washingUnitItems.inventoryId],
      references: [inventory.id],
    }),
    item: one(tableList, {
      fields: [washingUnitItems.itemId],
      references: [tableList.id],
    }),
  })
);

export type TNewWashingUnit = typeof washingUnit.$inferInsert;

export type TWashingUnit = typeof washingUnit.$inferSelect;

export type TNewWashingUnitItem = typeof washingUnitItems.$inferInsert;

export type TWashingUnitItem = typeof washingUnitItems.$inferSelect;

export type TWashingUnitItemFull = TWashingUnitItem & {
  washingUnit: TNewWashingUnit;
  category: TCategory;
  department: TDepartment;
  item: TTableList;
  inventory: TInventory;
};

export type TWashingUnitFull = TWashingUnit & {
  items: TWashingUnitItemFull[];
};
