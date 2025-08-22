"use server";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";

import { getEndDate, getStartDate } from "@/lib/dates";
import { db } from "@/lib/db";
import {
  inventory,
  quantity,
  tarpaulin,
  tarpaulinItem,
  TNewTarpaulin,
  TNewTarpaulinItem,
  TTarpaulinItem,
} from "@/lib/schemas";
import { GlobalQuantityObj } from "@/lib/utils";

import { addProducedQty } from "./quantity";

export const getTarpaulinList = async (
  shift?: string,
  from?: string,
  to?: string,
  offset?: number,
  limit?: number
) => {
  const where = and(
    !!shift ? eq(tarpaulin.shift, shift) : undefined,
    !!from ? gte(tarpaulin.date, getStartDate(from)) : undefined,
    !!to ? lte(tarpaulin.date, getEndDate(to)) : undefined
  );
  const data = await db.query.tarpaulin.findMany({
    where: where,
    limit,
    offset,
    with: {
      lamFabricGrade: true,
      tarpaulinGrade: true,
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
    .from(tarpaulin)
    .where(where);

  return { data: data, total: countData[0]?.count };
};

export const createTarpaulin = async (
  data: TNewTarpaulin,
  dataItems: Omit<TNewTarpaulinItem, "tarpId">[]
) => {
  let shouldDelete = false;
  let itemId: number | undefined = undefined;
  try {
    const response = await db.insert(tarpaulin).values(data).returning();

    shouldDelete = true;
    const newLam = response[0];

    itemId = newLam.id;

    const items: TTarpaulinItem[] = [];

    for (let index = 0; index < dataItems.length; index++) {
      const item = dataItems[index];

      const resp = await db
        .insert(tarpaulinItem)
        .values({
          ...item,
          tarpId: itemId!,
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
      .set({
        usedQty: sql`${quantity.usedQty} + ${newLam.lamFabricQty}`,
      })
      .where(eq(quantity.gradeId, newLam.lamFabricGradeId));

    await db
      .update(quantity)
      .set({
        producedQty: sql`${quantity.producedQty} + ${newLam.tarpaulinQty}`,
      })
      .where(eq(quantity.gradeId, newLam.tarpaulinGradeId));

    await addProducedQty(newLam.tarpWaste, GlobalQuantityObj.Tape_Waste);

    return {
      ...newLam,
      items,
    };
  } catch (error) {
    if (shouldDelete) {
      if (!!itemId) {
        await db.delete(tarpaulin).where(eq(tarpaulin.id, itemId));
      }
    }
    throw error;
  }
};

export const getTarpaulinById = (id: number) => {
  return db.query.tarpaulin.findFirst({
    where: eq(tarpaulin.id, id),
    with: {
      lamFabricGrade: true,
      tarpaulinGrade: true,
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
