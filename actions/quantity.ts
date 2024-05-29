"use server";

import { db } from "@/lib/db";
import { quantity } from "@/lib/schemas/quantity";
import { eq } from "drizzle-orm";

export const createQuantity = async (id: number) => {
  return db.insert(quantity).values({});
};

export const getQuantityDetails = async (id: number) => {
  return db.query.quantity.findFirst({ where: eq(quantity.id, id) });
};
