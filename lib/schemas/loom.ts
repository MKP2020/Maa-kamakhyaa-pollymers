import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const loom = pgTable("loom", {
  id: serial("id").primaryKey().notNull(),
  date: timestamp("date").defaultNow().notNull(),
  shift: varchar("shift", { length: 1 }).notNull(),

  tapeConsumed: varchar("tapeGrade", { length: 1 }).notNull(),
  tapeQty: integer("tapeQty").notNull(),
  tapeWaste: integer("tapeWaste").notNull(),
  tapeLumps: integer("tapeLumps").notNull(),
});
