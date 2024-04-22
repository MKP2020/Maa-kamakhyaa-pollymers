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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TCategory = typeof categories.$inferSelect;

export const bankDetails = pgTable("bankDetails", {
  id: serial("id").primaryKey(),
  accountNumber: text("accountNumber").notNull(),
  ifsc: text("ifsc").notNull(),
  branch: text("branch").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TBankingDetails = typeof bankDetails.$inferSelect;

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  addressLine1: text("addressLine1").notNull(),
  addressLine2: text("addressLine2"),
  city: text("city").notNull(),
  district: text("district").notNull(),
  state: text("state").notNull(),
  pinCode: varchar("pinCode", { length: 12 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type TAddress = typeof addresses.$inferSelect;

export const vendors = pgTable(
  "vendors",
  {
    id: serial("id").primaryKey(),
    type: integer("type").notNull().default(0),
    name: text("name").notNull(),
    contactNumber: varchar("contactNumber", { length: 12 }).notNull(),
    emailId: text("emailId").unique().notNull(),
    categoryId: integer("categoryId")
      .notNull()
      .references(() => categories.id),
    addressId: integer("addressId")
      .notNull()
      .references(() => addresses.id),
    bankDetailsId: integer("bankDetailsId")
      .notNull()
      .references(() => bankDetails.id),
    createdAt: timestamp("createdAt").defaultNow(),
    gstNumber: text("gstNumber").unique().notNull(),
    pan: varchar("pan", { length: 10 }).notNull(),
  },
  (vendors) => {
    return {
      nameIdx: index("name").on(vendors.name),
    };
  }
);

export type TVendors = typeof vendors.$inferSelect;

export const vendorsRelations = relations(vendors, ({ one }) => ({
  category: one(categories, {
    fields: [vendors.categoryId],
    references: [categories.id],
  }),
  address: one(addresses, {
    fields: [vendors.addressId],
    references: [addresses.id],
  }),
  bankDetails: one(bankDetails, {
    fields: [vendors.bankDetailsId],
    references: [bankDetails.id],
  }),
}));

export type TVendorsFull = typeof vendors.$inferSelect & {
  category: TCategory;
  bankDetails: TBankingDetails;
  address: TAddress;
};
