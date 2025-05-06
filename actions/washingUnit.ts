"use server";

import { and, count, eq, gte, ilike, lte } from "drizzle-orm";
import { WashingMachine } from "lucide-react";

import { db } from "@/lib/db";
import {
  inventory,
  quantity,
  TNewWashingUnit,
  TNewWashingUnitItem,
  TWashingUnitItem,
  washingUnit,
  washingUnitItems,
} from "@/lib/schemas";
import { getIdForType } from "@/lib/utils";
import { sql } from "@vercel/postgres";

export const getWashingUnits = async (
  search?: string,
  date?: string,
  shift?: string,
  offset?: number,
  limit?: number
) => {
  let where: any = undefined;

  if ((search || "").length === 0) {
    if (!!date) {
      if (!shift) {
        where = and(
          gte(washingUnit.date, new Date(date)),
          lte(
            washingUnit.date,
            new Date(new Date(date).setUTCHours(23, 59, 59, 999))
          )
        );
      } else {
        where = and(
          gte(washingUnit.date, new Date(date)),
          lte(
            washingUnit.date,
            new Date(new Date(date).setUTCHours(23, 59, 59, 999))
          ),
          eq(washingUnit.shift, shift)
        );
      }
    } else {
      if (!!shift) {
        where = eq(washingUnit.shift, shift);
      }
    }
  } else {
    if (!!date) {
      if (!shift) {
        where = and(
          ilike(washingUnit.id, "%" + search + "%"),
          gte(washingUnit.date, new Date(date)),
          lte(
            washingUnit.date,
            new Date(new Date(date).setUTCHours(23, 59, 59, 999))
          )
        );
      } else {
        where = and(
          ilike(washingUnit.id, "%" + search + "%"),
          gte(washingUnit.date, new Date(date)),
          lte(
            washingUnit.date,
            new Date(new Date(date).setUTCHours(23, 59, 59, 999))
          ),
          eq(washingUnit.shift, shift)
        );
      }
    } else {
      if (!shift) {
        where = ilike(washingUnit.id, "%" + search + "%");
      } else {
        where = and(
          ilike(washingUnit.id, "%" + search + "%"),
          eq(washingUnit.shift, shift)
        );
      }
    }
  }

  try {
    const data = await db.query.washingUnit.findMany({
      where,
      limit,
      offset,
      with: {
        items: {
          with: {
            item: true,
            inventory: true,
            department: true,
            category: true,
          },
        },
      },
    });

    const totalC = await db
      .select({ count: count() })
      .from(washingUnit)
      .where(where);

    return {
      data,
      total: totalC[0].count,
    };
  } catch (error) {
    return {
      data: [],
      total: 0,
    };
  }
};

export const getWashingUnitById = (id: number) => {
  return db.query.washingUnit.findFirst({
    where: eq(washingUnit.id, id),
    with: {
      items: {
        with: {
          item: true,
          inventory: true,
          department: true,
          category: true,
        },
      },
    },
  });
};

export const updateWashingUnit = async (
  id: number,
  note?: string,
  shift?: string,
  bhusaQuantity?: number
) => {
  return db
    .update(washingUnit)
    .set({ note, shift, bhusaQuantity })
    .where(eq(washingUnit.id, id))
    .returning();
};

export const createWashingUnit = async (
  data: TNewWashingUnit,
  items: Omit<TNewWashingUnitItem, "unitId">[]
) => {
  try {
    const res = await db.insert(washingUnit).values(data).returning();

    const newData = res[0];

    if (!newData) {
      throw new Error("Not able to save washing unit");
    }

    const newItems: TWashingUnitItem[] = [];
    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      const itemRes = await db
        .insert(washingUnitItems)
        .values({
          unitId: newData.id,
          ...element,
        })
        .returning();

      const inventoryItem = await db.query.inventory.findFirst({
        where: eq(inventory.id, element.inventoryId),
      });

      await db
        .update(inventory)
        .set({
          usedQuantity: inventoryItem!.usedQuantity + element.issueQuantity,
        })
        .where(eq(inventory.id, element.inventoryId));
      newItems.push(itemRes[0]);
    }

    if (newData.bhusaQuantity !== null) {
      const bhusaQuantity = await db.query.quantity.findFirst({
        where: eq(quantity.id, getIdForType("Bhusha")),
      });

      await db
        .update(quantity)
        .set({
          producedQty:
            (bhusaQuantity?.producedQty || 0) + newData.bhusaQuantity,
        })
        .where(eq(quantity.id, getIdForType("Bhusha")));
    }
    return {
      ...newData,
      items: newItems,
    };
  } catch (error) {
    throw error;
  }
};
