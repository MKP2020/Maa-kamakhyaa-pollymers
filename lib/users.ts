import { db } from "./db";
import { users } from "./schema";
import { TDepartment } from "./types";

export type NewUser = typeof users.$inferInsert;

export type TUser = typeof users.$inferSelect & {
  department: TDepartment | null;
};

export const getUserRole = (role: number) => {
  if (role === 0) return "admin";

  if (role === 1) return "employee";

  return "client";
};

export const getVendorType = (type: number) => {
  if (type === 0) return "Seller";

  return "Buyer";
};
