"use server";

import { db } from "@/lib/db";
import { quantity } from "@/lib/schemas/quantity";
import { GlobalQuantityObj } from "@/lib/utils";
import { and, eq, or, sql } from "drizzle-orm";

export const createQuantity = async (id: number) => {
  return db.insert(quantity).values({});
};

export const getQuantityDetails = async (id: number) => {
  return db.query.quantity.findFirst({ where: eq(quantity.id, id) });
};

export const getQuantitiesByIds = async (items: number[]) => {
  return db.query.quantity.findMany({
    where: or(...items.map((id) => eq(quantity.id, id))),
  });
};

export const addProducedQty = async (qty: number, id: number) => {
  return await db
    .update(quantity)
    .set({ producedQty: sql`${quantity.producedQty} + ${qty}` })
    .where(eq(quantity.id, id))
    .returning();
};
