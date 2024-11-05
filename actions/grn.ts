"use server";

import {
  TInventory,
  TNewInventory,
  grnNumbers,
  grns,
  inventory,
  purchaseOrders,
} from "@/lib/schema";
import { and, count, eq, gte, ilike, lte } from "drizzle-orm";

import { TNewGRN } from "@/lib/types";
import { db } from "@/lib/db";
import { getYear } from "date-fns";
import { revalidatePath } from "next/cache";

export const getGrns = async (
  search?: string,
  from?: string,
  to?: string,
  offset?: number,
  limit?: number
) => {
  let where: any = undefined;

  if ((search || "").length === 0) {
    if (!!from && !!to) {
      where = and(
        gte(grns.receivedDate, new Date(new Date(from).setHours(0, 0, 0, 0))),
        lte(grns.receivedDate, new Date(new Date(to).setHours(23, 59, 59, 999)))
      );
    } else if (!!from && !to) {
      where = gte(
        grns.receivedDate,
        new Date(new Date(from).setHours(0, 0, 0, 0))
      );
    } else if (!from && !!to) {
      where = gte(
        grns.receivedDate,
        new Date(new Date(to).setHours(23, 59, 59, 999))
      );
    }
  } else {
    if (!!from && !!to) {
      where = and(
        ilike(grns.grnNumber, search + "%"),
        gte(grns.receivedDate, new Date(new Date(from).setHours(0, 0, 0, 0))),
        lte(grns.receivedDate, new Date(new Date(to).setHours(23, 59, 59, 999)))
      );
    } else if (!!from && !to) {
      where = and(
        ilike(grns.grnNumber, search + "%"),
        gte(grns.receivedDate, new Date(new Date(from).setHours(0, 0, 0, 0)))
      );
    } else if (!from && !!to) {
      where = and(
        ilike(grns.grnNumber, search + "%"),
        gte(grns.receivedDate, new Date(new Date(to).setHours(23, 59, 59, 999)))
      );
    } else {
      where = ilike(grns.grnNumber, search + "%");
    }
  }

  try {
    const data = await db.query.grns.findMany({
      where,
      limit,
      offset,
      with: {
        po: {
          with: {
            items: true,
            seller: { with: { address: true } },
            indent: true,
          },
        },
        items: { with: { item: true, poItem: { with: { item: true } } } },
      },
    });

    const totalC = await db.select({ count: count() }).from(grns).where(where);

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

export const createGrn = async (
  grnData: TNewGRN,
  items: Omit<TNewInventory, "grnId">[]
) => {
  try {
    const year = getYear(grnData.receivedDate!);

    const count = await db.query.grnNumbers.findFirst({
      where: eq(grnNumbers.year, year),
    });

    let grnNumber = grnData.grnNumber;

    if (!count) {
      grnNumber += "1";
    } else {
      grnNumber += count.currentCount + 1;
    }

    const res = await db
      .insert(grns)
      .values({
        ...grnData,
        grnNumber,
      })
      .returning();

    const newGRN = res[0];
    await db
      .update(purchaseOrders)
      .set({ status: 1 })
      .where(eq(purchaseOrders.id, newGRN.poId));

    if (!count) {
      await db.insert(grnNumbers).values({ currentCount: 1, year });
    } else {
      await db
        .update(grnNumbers)
        .set({ currentCount: (count?.currentCount || 0) + 1 })
        .where(eq(grnNumbers.year, year));
    }

    if (newGRN) {
      const itemList: TInventory[] = [];

      for (let index = 0; index < items.length; index++) {
        const element = items[index];

        const nRes = await db
          .insert(inventory)
          .values({
            ...element,

            grnId: newGRN.id,
          })
          .returning();
        itemList.push(nRes[0]);
      }

      return {
        ...newGRN,
        items: itemList,
      };
    }
    throw new Error("failed to create indent");
  } catch (error) {
    throw error;
  }
};

export const getGrnById = (id: number) => {
  return db.query.grns.findFirst({
    where: eq(grns.id, id),

    with: {
      po: { with: { items: { with: { item: { with: { item: true } } } } } },
      items: {
        with: {
          item: true,
        },
      },
    },
  });
};

export const deleteGrn = async (id: number) => {
  await db.delete(grns).where(eq(grns.id, id));
  await db.delete(inventory).where(eq(inventory.grnId, id));
  revalidatePath("/dashboard/grn");
  return;
};
