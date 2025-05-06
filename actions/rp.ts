"use server";

import { and, count, eq, gte, lte } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  inventory,
  quantity,
  quantityFor,
  rp,
  rpItems,
  TNewRp,
  TNewRpItem,
  TRpItem,
} from "@/lib/schemas";
import {
  getRpProducedId,
  GlobalQuantityObj,
  TGlobalQuantityType,
} from "@/lib/utils";

const updatedUsedQty = async (
  type: TGlobalQuantityType,
  qty?: number | null,
  date?: Date
) => {
  if (qty && (qty || 0) > 0) {
    const where = eq(quantity.id, GlobalQuantityObj[type]);
    const res = await db.query.quantity.findFirst({
      where,
    });

    if (res) {
      await db
        .update(quantity)
        .set({ usedQty: res.usedQty + qty })
        .where(where);
    }

    await db.insert(quantityFor).values({
      date: date || new Date(),
      for: GlobalQuantityObj[type],
      type: "used",
      qty,
    });
  }
};

export const createRp = async (
  data: TNewRp,
  dataItems: Omit<TNewRpItem, "rpId">[]
) => {
  try {
    const response = await db.insert(rp).values(data).returning();

    const rpData = response[0];

    if (rpData) {
      const items: TRpItem[] = [];

      for (let index = 0; index < dataItems.length; index++) {
        const item = dataItems[index];

        const resp = await db
          .insert(rpItems)
          .values({
            ...item,
            rpId: rpData.id,
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

      if (data.type === 4) {
        await updatedUsedQty("Lam_Waste", data.lamQty, rpData.date);
        await updatedUsedQty("Loom_Waste", data.loomQty, rpData.date);
        await updatedUsedQty("Tape_Waste", data.tapeQty, rpData.date);
        await updatedUsedQty("Tarp_Waste", data.tarpQty, rpData.date);
      } else {
        const qData = await db.query.quantity.findFirst({
          where: eq(quantity.id, getRpProducedId(data.type.toString())),
        });

        await db
          .update(quantity)
          .set({ producedQty: (qData?.producedQty || 0) + rpData.producedQty })
          .where(eq(quantity.id, getRpProducedId(data.type.toString())));

        await db.insert(quantityFor).values({
          date: rpData.date,
          for: getRpProducedId(data.type.toString()),
          type: "produced",
          qty: rpData.producedQty,
        });
      }
      return { ...rpData, items: items };
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const getRpList = async (
  type: number,
  shift?: string,
  from?: string,
  to?: string,
  offset?: number,
  limit?: number
) => {
  const where = and(
    type !== undefined ? eq(rp.type, type) : undefined,
    !!shift ? eq(rp.shift, shift) : undefined,
    !!from
      ? gte(rp.date, new Date(new Date(from).setHours(0, 0, 0, 0)))
      : undefined,
    !!to
      ? lte(rp.date, new Date(new Date(to).setHours(23, 59, 59, 999)))
      : undefined
  );
  const data = await db.query.rp.findMany({
    where: where,
    limit,
    offset,
  });

  const countData = await db.select({ count: count() }).from(rp).where(where);

  return { data: data, total: countData[0]?.count };
};

export const getRpById = (id: number) => {
  return db.query.rp.findFirst({
    where: eq(rp.id, id),
    with: {
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
