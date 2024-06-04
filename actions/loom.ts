"use server";
import { db } from "@/lib/db";
import {
  TLoomItem,
  TNewLoom,
  TNewLoomItem,
  inventory,
  loom,
  loomItem,
  quantity,
} from "@/lib/schemas";
import { and, eq, sql, gte, lte, count } from "drizzle-orm";
import { addProducedQty } from "./quantity";
import { GlobalQuantityObj } from "@/lib/utils";

export const getLoomList = async (
  shift?: string,
  from?: string,
  to?: string,
  offset?: number,
  limit?: number
) => {
  const where = and(
    !!shift ? eq(loom.shift, shift) : undefined,
    !!from
      ? gte(loom.date, new Date(new Date(from).setHours(0, 0, 0, 0)))
      : undefined,
    !!to
      ? lte(loom.date, new Date(new Date(to).setHours(23, 59, 59, 999)))
      : undefined
  );
  const data = await db.query.loom.findMany({
    where: where,
    limit,
    offset,
    with: {
      tapeGrade: true,
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

  const countData = await db.select({ count: count() }).from(loom).where(where);

  return { data: data, total: countData[0]?.count };
};

export const createLoom = async (
  data: TNewLoom,
  dataItems: Omit<TNewLoomItem, "loomId">[]
) => {
  let shouldDelete = false;
  let itemId: number | undefined = undefined;
  try {
    const response = await db.insert(loom).values(data).returning();

    shouldDelete = true;
    const newLoom = response[0];

    itemId = newLoom.id;

    const items: TLoomItem[] = [];

    for (let index = 0; index < dataItems.length; index++) {
      const item = dataItems[index];

      const resp = await db
        .insert(loomItem)
        .values({
          ...item,
          loomId: itemId!,
        })
        .returning();

      const inventoryData = await db.query.inventory.findFirst({
        where: eq(inventory.id, resp[0].inventoryId),
      });

      await db.update(inventory).set({
        usedQuantity: inventoryData!.usedQuantity + resp[0].quantity,
      });

      items.push(resp[0]);
    }

    await db
      .update(quantity)
      .set({ usedQty: sql`${quantity.usedQty} + ${newLoom.tapeQty}` })
      .where(eq(quantity.gradeId, newLoom.tapeGradeId));

    await db
      .update(quantity)
      .set({ producedQty: sql`${quantity.producedQty} + ${newLoom.fabricQty}` })
      .where(eq(quantity.gradeId, newLoom.fabricGradeId));

    await addProducedQty(newLoom.loomWaste, GlobalQuantityObj.Loom_Waste);

    return {
      ...newLoom,
      items,
    };
  } catch (error) {
    if (shouldDelete) {
      if (!!itemId) {
        await db.delete(loom).where(eq(loom.id, itemId));
      }
    }
    throw error;
  }
};

export const getLoomById = (id: number) => {
  return db.query.loom.findFirst({
    where: eq(loom.id, id),
    with: {
      tapeGrade: true,
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
