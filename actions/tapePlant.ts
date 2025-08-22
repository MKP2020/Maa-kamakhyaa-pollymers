"use server";

import { and, count, eq, gte, lte, sql } from "drizzle-orm";

import { getEndDate, getStartDate } from "@/lib/dates";
import { db } from "@/lib/db";
import {
  inventory,
  quantity,
  tapeItem,
  tapePlant,
  tapePlantConsumedItem,
  TNewTape,
  TNewTapeConsumedItem,
  TNewTapeItem,
  TTape,
  TTapeConsumedItem,
  TTapeItem,
} from "@/lib/schemas";
import { getRpProducedId, GlobalQuantityObj } from "@/lib/utils";

import { addProducedQty } from "./quantity";

export const getTapePlantList = async (
  shift?: string,
  from?: string,
  to?: string,
  offset?: number,
  limit?: number
) => {
  const where = and(
    !!shift ? eq(tapePlant.shift, shift) : undefined,
    !!from ? gte(tapePlant.date, getStartDate(from)) : undefined,
    !!to ? lte(tapePlant.date, getEndDate(to)) : undefined
  );
  const data = await db.query.tapePlant.findMany({
    where: where,
    limit,
    offset,
    with: {
      tapeGrade: true,
      items: {
        with: {
          department: true,
          category: true,
          inventory: true,
          item: true,
        },
      },
      consumedItems: true,
    },
  });

  const countData = await db
    .select({ count: count() })
    .from(tapePlant)
    .where(where);

  return { data: data, total: countData[0]?.count };
};

export const createTapePlant = async (
  data: TNewTape,
  dataItems: Omit<TNewTapeItem, "tapeId">[],
  dataConsumedItems: Omit<TNewTapeConsumedItem, "tapeId">[]
) => {
  let shouldDelete = true;
  let itemId;
  try {
    const response = await db.insert(tapePlant).values(data).returning();

    shouldDelete = true;
    const tape = response[0];

    await db
      .update(quantity)
      .set({ producedQty: sql`${quantity.producedQty} + ${tape.tapeQty}` })
      .where(eq(quantity.gradeId, tape.tapeGradeId))
      .returning();

    itemId = tape.id;

    const items: TTapeItem[] = [];

    for (let index = 0; index < dataItems.length; index++) {
      const item = dataItems[index];

      const resp = await db
        .insert(tapeItem)
        .values({
          ...item,
          tapeId: itemId!,
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

    const consumedItems: TTapeConsumedItem[] = [];

    for (let index = 0; index < dataConsumedItems.length; index++) {
      const item = dataConsumedItems[index];

      const resp = await db
        .insert(tapePlantConsumedItem)
        .values({
          ...item,
          tapeId: itemId!,
        })
        .returning();

      // const qData = await db.query.quantity.findFirst({
      //   where: eq(quantity.id, item.rpType),
      // });

      // await db
      //   .update(quantity)
      //   .set({ producedQty: (qData?.producedQty || 0) + item.qty })
      //   .where(eq(quantity.id, item.rpType));
      await addProducedQty(item.qty, item.rpType);
      consumedItems.push(resp[0]);
    }

    if (data.tapeWaste > 0) {
      await addProducedQty(data.tapeWaste, GlobalQuantityObj.Tape_Waste);
    }
    if (data.tapeLumps > 0) {
      await addProducedQty(data.tapeLumps, GlobalQuantityObj.TapeLumps);
    }

    return { ...tape, items, consumedItems };
  } catch (error) {
    if (shouldDelete) {
      if (!!itemId) {
        await db.delete(tapePlant).where(eq(tapePlant.id, itemId));
      }
    }
    throw error;
  }
};

export const getTapePlantById = (id: number) =>
  db.query.tapePlant.findFirst({
    where: eq(tapePlant.id, id),
    with: {
      tapeGrade: true,
      items: {
        with: {
          department: true,
          item: true,
          inventory: true,
          category: true,
        },
      },
      consumedItems: true,
    },
  });
