import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { inventory } from "./inventory";

export const departments = pgTable("departments", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 256 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const departmentsRelations = relations(departments, ({ many }) => ({
  inventory: many(inventory),
}));

export type TDepartment = typeof departments.$inferSelect;
