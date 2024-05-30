import { bigint, integer, pgTable, serial } from "drizzle-orm/pg-core";

export const quantity = pgTable("quantity", {
  id: serial("id").primaryKey().notNull(),
  producedQty: bigint("producedQty", { mode: "number" }).default(0).notNull(),
  usedQty: bigint("usedQty", { mode: "number" }).default(0).notNull(),
});

export type TQuantity = typeof quantity.$inferSelect;
