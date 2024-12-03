import {
  decimal,
  doublePrecision,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { departments, inventory } from "./schemas";

import { relations } from "drizzle-orm";

export * from "./schemas";

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

export const tableList = pgTable(
  "tableList",
  {
    id: serial("id").primaryKey().notNull(),
    categoryId: integer("categoryId")
      .notNull()
      .references(() => categories.id),
    name: text("name").notNull().unique(),
    minQuantity: doublePrecision("minQuantity").notNull(),
    unit: varchar("unit", { length: 256 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (tableList) => {
    return {
      itemCategoryIdx: index("itemCategoryIdx").on(tableList.categoryId),
    };
  }
);

export type TTableList = typeof tableList.$inferSelect;

export type TNewTableList = typeof tableList.$inferInsert;

export type TTableListFull = TTableList & { category: TCategory };

export const tableListRelations = relations(tableList, ({ one }) => ({
  category: one(categories, {
    fields: [tableList.categoryId],
    references: [categories.id],
  }),
}));

export const indentItems = pgTable("indentItems", {
  id: serial("id").primaryKey().notNull(),
  indentId: integer("indentId")
    .notNull()
    .references(() => indents.id),

  itemId: integer("itemId")
    .notNull()
    .references(() => tableList.id),

  indentedQty: doublePrecision("indentedQty").notNull(),
  approvedQty: doublePrecision("approvedQty"),
});

export const indents = pgTable("indents", {
  id: serial("id").primaryKey().notNull(),
  indentNumber: varchar("indentNumber", { length: 30 }).unique().notNull(),
  departmentId: integer("departmentId")
    .notNull()
    .references(() => departments.id),
  categoryId: integer("categoryId")
    .references(() => categories.id)
    .notNull(),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  note: text("note"),
});

export const indentItemsRelation = relations(indentItems, ({ one }) => ({
  indent: one(indents, {
    fields: [indentItems.indentId],
    references: [indents.id],
  }),
  item: one(tableList, {
    fields: [indentItems.itemId],
    references: [tableList.id],
  }),
}));

export const indentsRelation = relations(indents, ({ many, one }) => ({
  items: many(indentItems),
  department: one(departments, {
    fields: [indents.departmentId],
    references: [departments.id],
  }),
  category: one(categories, {
    fields: [indents.categoryId],
    references: [categories.id],
  }),
}));

export const indentNumbers = pgTable("indentNumber", {
  id: serial("id").primaryKey().notNull(),
  year: integer("year").notNull(),
  currentCount: integer("currentCount").notNull(),
});

export const purchaseOrderItems = pgTable("purchaseOrderItems", {
  id: serial("id").primaryKey().notNull(),
  poId: integer("poId")
    .notNull()
    .references(() => purchaseOrders.id),
  itemId: integer("itemId")
    .notNull()
    .references(() => indentItems.id),
  price: doublePrecision("price").notNull(),
  quantity: doublePrecision("quantity").notNull(),
});

export const purchaseOrders = pgTable("purchaseOrders", {
  id: serial("id").primaryKey().notNull(),
  poNumber: varchar("poNumber", { length: 30 }).unique().notNull(),
  sellerId: integer("sellerId")
    .notNull()
    .references(() => vendors.id),
  indentId: integer("indentId")
    .notNull()
    .references(() => indents.id),
  date: timestamp("date").defaultNow().notNull(),

  taxType: varchar("taxType", { length: 10 }).notNull(),
  sgst: doublePrecision("sgst").default(0),
  igst: doublePrecision("igst").default(0),
  cgst: doublePrecision("cgst").default(0),

  approvalStatus: integer("approvalStatus").default(2).notNull(),
  status: integer("status").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const purchaseOrderItemsRelation = relations(
  purchaseOrderItems,
  ({ one }) => ({
    po: one(purchaseOrders, {
      fields: [purchaseOrderItems.poId],
      references: [purchaseOrders.id],
    }),
    item: one(indentItems, {
      fields: [purchaseOrderItems.itemId],
      references: [indentItems.id],
    }),
  })
);

export const purchaseOrdersRelations = relations(
  purchaseOrders,
  ({ many, one }) => ({
    items: many(purchaseOrderItems),
    seller: one(vendors, {
      fields: [purchaseOrders.sellerId],
      references: [vendors.id],
    }),
    indent: one(indents, {
      fields: [purchaseOrders.indentId],
      references: [indents.id],
    }),
  })
);

export const purchaseOrderNumbers = pgTable("purchaseOrderNumbers", {
  id: serial("id").primaryKey().notNull(),
  year: integer("year").notNull(),
  currentCount: integer("currentCount").notNull(),
});

export const grns = pgTable("grn", {
  id: serial("id").primaryKey().notNull(),
  grnNumber: varchar("grnNumber", { length: 30 }).unique().notNull(),
  poId: integer("poId").notNull(),
  receivedDate: timestamp("receivedDate").defaultNow().notNull(),
  invoiceNumber: text("invoiceNumber").notNull(),
  invoiceDate: timestamp("invoiceDate").defaultNow().notNull(),
  transportMode: varchar("transportMode", { length: 15 }).notNull(),
  transportName: text("transportName").notNull(),
  cnNumber: varchar("cnNumber", { length: 30 }).notNull(),
  vehicleNumber: varchar("vehicleNumber", { length: 30 }).notNull(),
  freightAmount: integer("freightAmount").notNull(),
  taxType: varchar("taxType", { length: 10 }).notNull(),
  sgst: doublePrecision("sgst").default(0),
  igst: doublePrecision("igst").default(0),
  cgst: doublePrecision("cgst").default(0),
});

export const grnNumbers = pgTable("grnNumbers", {
  id: serial("id").primaryKey().notNull(),
  year: integer("year").notNull(),
  currentCount: integer("currentCount").notNull(),
});

export const grnRelations = relations(grns, ({ many, one }) => ({
  items: many(inventory),
  po: one(purchaseOrders, {
    fields: [grns.poId],
    references: [purchaseOrders.id],
  }),
}));
