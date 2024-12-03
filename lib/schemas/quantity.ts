import {
  bigserial,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";

import type { TGrade } from "../types";
import { grades } from "./grades";
import { relations } from "drizzle-orm";

export const quantity = pgTable("quantity", {
  id: serial("id").primaryKey().notNull(),
  producedQty: doublePrecision("producedQty").default(0).notNull(),
  usedQty: doublePrecision("usedQty").default(0).notNull(),
  gradeId: integer("gradeId").references(() => grades.id),
});

export const quantityRelation = relations(quantity, ({ one }) => ({
  grade: one(grades, {
    fields: [quantity.gradeId],
    references: [grades.id],
  }),
}));

export type TQuantity = typeof quantity.$inferSelect;

export type TQuantityFull = TQuantity & {
  grade?: TGrade;
};

export const typeEnum = pgEnum("type", ["used", "produced"]);

export const quantityFor = pgTable("quantity-for", {
  id: bigserial("id", { mode: "number" }).primaryKey().notNull(),
  for: integer("for").notNull(),
  type: typeEnum("type").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  qty: doublePrecision("usedQty").default(0).notNull(),
  gradeId: integer("gradeId").references(() => grades.id),
});

export type TNewQuantityFor = typeof quantityFor.$inferInsert;

export type TQuantityFor = typeof quantityFor.$inferSelect;
