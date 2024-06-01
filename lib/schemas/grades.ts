import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";

export const grades = pgTable("grades", {
  id: serial("id").primaryKey().notNull(),
  type: integer("type").default(0).notNull(),
  grade: text("grade").notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
