"use server";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";

import { getEndDate, getStartDate } from "@/lib/dates";
import { db } from "@/lib/db";
import {
  inventory,
  lamination,
  lamItem,
  quantity,
  TLamItem,
  TNewLam,
  TNewLamItem,
} from "@/lib/schemas";
import { GlobalQuantityObj } from "@/lib/utils";

import { addProducedQty } from "./quantity";

export const getLamList = async (
  shift?: string,
  from?: string,
  to?: string,
  offset?: number,
  limit?: number
) => {
  const where = and(
    !!shift ? eq(lamination.shift, shift) : undefined,
    !!from ? gte(lamination.date, getStartDate(from)) : undefined,
    !!to ? lte(lamination.date, getEndDate(to)) : undefined
  );
  const data = await db.query.lamination.findMany({
    where: where,
    limit,
    offset,
    with: {
      lamFabricGrade: true,
      fabricGrade: true,
      items: {
        with: {
          department: true,
          category: true,
          inventory: true,
          item: true,
        },
      },
    },
  });

  const countData = await db
    .select({ count: count() })
    .from(lamination)
    .where(where);

  return { data: data, total: countData[0]?.count };
};

export const createLam = async (
  data: TNewLam,
  dataItems: Omit<TNewLamItem, "lamId">[]
) => {
  let shouldDelete = false;
  let itemId: number | undefined = undefined;
  try {
    const response = await db.insert(lamination).values(data).returning();

    shouldDelete = true;
    const newLam = response[0];

    itemId = newLam.id;

    const items: TLamItem[] = [];

    for (let index = 0; index < dataItems.length; index++) {
      const item = dataItems[index];

      const resp = await db
        .insert(lamItem)
        .values({
          ...item,
          lamId: itemId!,
        })
        .returning();

      const inventoryData = await db.query.inventory.findFirst({
        where: eq(inventory.id, resp[0].inventoryId),
      });

      await db
        .update(inventory)
        .set({
          usedQuantity: inventoryData!.usedQuantity + resp[0].quantity,
        })
        .where(eq(inventory.id, inventoryData!.id));

      items.push(resp[0]);
    }

    await db
      .update(quantity)
      .set({ usedQty: sql`${quantity.usedQty} + ${newLam.fabricQty}` })
      .where(eq(quantity.gradeId, newLam.fabricGradeId));

    await db
      .update(quantity)
      .set({
        producedQty: sql`${quantity.producedQty} + ${newLam.lamFabricQty}`,
      })
      .where(eq(quantity.gradeId, newLam.lamFabricGradeId));

    await addProducedQty(newLam.lamWaste, GlobalQuantityObj.Lam_Waste);

    return {
      ...newLam,
      items,
    };
  } catch (error) {
    if (shouldDelete) {
      if (!!itemId) {
        await db.delete(lamination).where(eq(lamination.id, itemId));
      }
    }
    throw error;
  }
};

export const getLamById = (id: number) => {
  return db.query.lamination.findFirst({
    where: eq(lamination.id, id),
    with: {
      lamFabricGrade: true,
      fabricGrade: true,
      items: {
        with: {
          department: true,
          category: true,
          inventory: true,
          item: true,
        },
      },
    },
  });
};
