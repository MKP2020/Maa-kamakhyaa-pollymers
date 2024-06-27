import { db } from "./db";
import { users } from "./schema";
import { TDepartment } from "./types";
import { USER_TYPES } from "./utils";

export type NewUser = typeof users.$inferInsert;

export type TUser = typeof users.$inferSelect & {};

export const getUserRole = (role: number) => {
  return USER_TYPES[role];
};

export const getVendorType = (type: number) => {
  if (type === 0) return "Seller";

  return "Buyer";
};
