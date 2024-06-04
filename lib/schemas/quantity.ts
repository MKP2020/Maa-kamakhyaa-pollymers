import { bigint, integer, pgTable, serial } from "drizzle-orm/pg-core";
import { grades } from "./grades";
import { relations } from "drizzle-orm";
import type { TGrade } from "../types";

export const quantity = pgTable("quantity", {
  id: serial("id").primaryKey().notNull(),
  producedQty: bigint("producedQty", { mode: "number" }).default(0).notNull(),
  usedQty: bigint("usedQty", { mode: "number" }).default(0).notNull(),
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
