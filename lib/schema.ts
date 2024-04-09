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

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("firstName", { length: 256 }).notNull(),
  lastName: varchar("lastName", { length: 256 }).notNull(),
  role: integer("role").notNull(),
  email: text("email").unique().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  clerkId: text("clerkId").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const bankDetails = pgTable("bankDetails", {
  id: serial("id").primaryKey(),
  accountNumber: text("accountNumber").notNull(),
  ifsc: text("ifsc").notNull(),
  branch: text("branch").notNull(),
  venderId: integer("venderId").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  addressLine1: text("addressLine1").notNull(),
  addressLine2: text("addressLine2"),
  city: text("city").notNull(),
  district: text("district").notNull(),
  state: text("state").notNull(),
  pinCode: varchar("pinCode", { length: 12 }).notNull(),
  gstNumber: text("gstNumber").unique().notNull(),
  pan: varchar("pan", { length: 10 }).notNull(),
  venderId: integer("venderId").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const venders = pgTable(
  "venders",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    contactNumber: varchar("contactNumber", { length: 12 }).notNull(),
    emailId: text("emailId").unique().notNull(),
    categoryId: integer("categoryId")
      .notNull()
      .references(() => categories.id),
    addressId: integer("addressId")
      .notNull()
      .references(() => addresses.id),
    bankDerailsId: integer("bankDerailsId")
      .notNull()
      .references(() => bankDetails.id),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (venders) => {
    return {
      nameIdx: index("name").on(venders.name),
    };
  }
);

export const vendersRelations = relations(venders, ({ one }) => ({
  category: one(categories, {
    fields: [venders.categoryId],
    references: [categories.id],
  }),
  address: one(addresses, {
    fields: [venders.addressId],
    references: [addresses.id],
  }),
  bankDerails: one(bankDetails, {
    fields: [venders.bankDerailsId],
    references: [bankDetails.id],
  }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  vender: one(venders, {
    fields: [addresses.venderId],
    references: [venders.id],
  }),
}));

export const bankDetailsRelations = relations(bankDetails, ({ one }) => ({
  vender: one(venders, {
    fields: [bankDetails.venderId],
    references: [venders.id],
  }),
}));
