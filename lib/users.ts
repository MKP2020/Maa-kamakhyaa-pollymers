import { db } from "./db";
import { users } from "./schema";

export type NewUser = typeof users.$inferInsert;

export const getUserRole = (role: number) => {
  if (role === 0) return "admin";

  if (role === 1) return "employee";

  return "client";
};
