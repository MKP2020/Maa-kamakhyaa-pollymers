"use server";
import { db } from "@/lib/db";
import { grnItems, grnNumbers, grns, purchaseOrders } from "@/lib/schema";
import { TGRNItem, TNewGRN, TNewGRNItem } from "@/lib/types";
import { getYear } from "date-fns";
import { and, count, eq, gte, ilike, lte } from "drizzle-orm";

export const getGrns = async (
  search?: string,
  date?: string,
  offset?: number,
  limit?: number
) => {
  let where: any = undefined;

  if ((search || "").length === 0) {
    if (!!date) {
      console.log("Adding date", date, new Date(date));
      const end = new Date(date).getMilliseconds() + 86400000;
      where = and(
        gte(grns.receivedDate, new Date(date)),
        lte(
          grns.receivedDate,
          new Date(new Date(date).setUTCHours(23, 59, 59, 999))
        )
      );
    }
  } else {
    if (!!date) {
      where = and(
        ilike(grns.grnNumber, search + "%"),
        gte(grns.receivedDate, new Date(date)),
        lte(
          grns.receivedDate,
          new Date(new Date(date).setUTCHours(23, 59, 59, 999))
        )
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
        po: true,
        items: true,
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
  items: Omit<TNewGRNItem, "grnId">[]
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
      const itemList: TGRNItem[] = [];

      for (let index = 0; index < items.length; index++) {
        const element = items[index];

        const nRes = await db
          .insert(grnItems)
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
      po: true,
      items: {
        with: {
          item: true,
        },
      },
    },
  });
};
