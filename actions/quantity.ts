"use server";

import { and, eq, or, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { quantity } from "@/lib/schemas/quantity";
import { GlobalQuantityObj } from "@/lib/utils";

export const createQuantity = async (gradeId?: number) => {
  return db.insert(quantity).values({ gradeId });
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

export const getAllQuantities = () => {
  return db.query.quantity.findMany({
    with: {
      grade: true,
    },
  });
};
