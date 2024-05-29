import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
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
import { relations } from "drizzle-orm";
import { TTableList } from "../types";

export const rp = pgTable(
  "rp",
  {
    id: serial("id").primaryKey().notNull(),
    date: timestamp("date").defaultNow().notNull(),
    shift: varchar("shift", { length: 1 }).notNull(),
    type: integer("type").notNull(),

    consumedQty: integer("consumedQty").notNull(),
    producedQty: integer("producedQty").notNull(),

    plantWasteConsumed: integer("plantWasteConsumed"),
    rpLumps: integer("rpLumps"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (item) => ({
    rpDateIdx: index("rpDateIdx").on(item.date),
    rpTypeIdx: index("rpTypeIdx").on(item.type),
    rpShiftIdx: index("rpShiftIdx").on(item.shift),
  })
);

export const rpItems = pgTable(
  "rpItems",
  {
    id: serial("id").primaryKey().notNull(),

    rpId: integer("rpId")
      .notNull()
      .references(() => rp.id),
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
    rpItemsIdIdx: index("rpItemsIdIdx").on(item.rpId),
    rpItemsCategoryIdx: index("rpItemsCategoryIdx").on(item.categoryId),
    rpItemsDepartmentIdx: index("rpItemsDepartmentIdx").on(item.departmentId),
  })
);

export const rpItemsRelations = relations(rpItems, ({ one }) => ({
  rp: one(rp, {
    fields: [rpItems.rpId],
    references: [rp.id],
  }),
  department: one(departments, {
    fields: [rpItems.departmentId],
    references: [departments.id],
  }),
  category: one(categories, {
    fields: [rpItems.categoryId],
    references: [categories.id],
  }),
  inventory: one(inventory, {
    fields: [rpItems.inventoryId],
    references: [inventory.id],
  }),
  item: one(tableList, {
    fields: [rpItems.itemId],
    references: [tableList.id],
  }),
}));

export const rpRelations = relations(rp, ({ many }) => ({
  items: many(rpItems),
}));

export type TNewRp = typeof rp.$inferInsert;

export type TRp = typeof rp.$inferSelect;

export type TNewRpItem = typeof rpItems.$inferInsert;

export type TRpItem = typeof rpItems.$inferSelect;

export type TRpItemFull = TRpItem & {
  department: TDepartment;
  category: TCategory;
  item: TTableList;
  inventory: TInventory;
};

export type TRpFull = TRp & {
  items: TRpItemFull[];
};
