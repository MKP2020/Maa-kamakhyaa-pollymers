"use server";

import { db } from "@/lib/db";
import {
  TNewTape,
  TNewTapeConsumedItem,
  TNewTapeItem,
  TTape,
  TTapeConsumedItem,
  TTapeItem,
  inventory,
  quantity,
  tapeItem,
  tapePlant,
  tapePlantConsumedItem,
} from "@/lib/schemas";
import { GlobalQuantityObj, getRpProducedId } from "@/lib/utils";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";
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
    !!from
      ? gte(tapePlant.date, new Date(new Date(from).setHours(0, 0, 0, 0)))
      : undefined,
    !!to
      ? lte(tapePlant.date, new Date(new Date(to).setHours(23, 59, 59, 999)))
      : undefined
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

    console.log("tape produced");
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

      console.log("tape produced item", resp);
      const inventoryData = await db.query.inventory.findFirst({
        where: eq(inventory.id, resp[0].inventoryId),
      });

      await db.update(inventory).set({
        usedQuantity: inventoryData!.usedQuantity + resp[0].quantity,
      });

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
      console.log("tape produced item", resp);
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
