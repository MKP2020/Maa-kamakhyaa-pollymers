"use server";
import { db } from "@/lib/db";
import {
  type TNewLam,
  type TNewLamItem,
  type TLamItem,
  inventory,
  lamItem,
  lamination,
  quantity,
} from "@/lib/schemas";
import { and, eq, sql, gte, lte, count } from "drizzle-orm";
import { addProducedQty } from "./quantity";
import { GlobalQuantityObj } from "@/lib/utils";

export const getLamList = async (
  shift?: string,
  from?: string,
  to?: string,
  offset?: number,
  limit?: number
) => {
  const where = and(
    !!shift ? eq(lamination.shift, shift) : undefined,
    !!from
      ? gte(lamination.date, new Date(new Date(from).setHours(0, 0, 0, 0)))
      : undefined,
    !!to
      ? lte(lamination.date, new Date(new Date(to).setHours(23, 59, 59, 999)))
      : undefined
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

      await db.update(inventory).set({
        usedQuantity: inventoryData!.usedQuantity + resp[0].quantity,
      });

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
