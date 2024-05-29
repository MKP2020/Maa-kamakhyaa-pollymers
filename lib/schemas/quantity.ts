import { integer, pgTable, serial } from "drizzle-orm/pg-core";

export const quantity = pgTable("quantity", {
  id: serial("id").primaryKey().notNull(),
  producedQty: integer("producedQty").default(0).notNull(),
  usedQty: integer("usedQty").default(0).notNull(),
});

export type TQuantity = typeof quantity.$inferSelect;
