import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { quantity } from "./quantity";
import { relations } from "drizzle-orm";

export const grades = pgTable("grades", {
  id: serial("id").primaryKey().notNull(),
  type: integer("type").default(0).notNull(),
  grade: text("grade").notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const gradesRelation = relations(grades, ({ one }) => ({
  quantity: one(quantity),
}));
