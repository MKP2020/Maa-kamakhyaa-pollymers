"use server";

import { db } from "@/lib/db";
import { purchaseOrders } from "@/lib/schema";
import { and, count, eq, gte, ilike, lte } from "drizzle-orm";

export const getPurchaseOrders = async (
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
        gte(purchaseOrders.date, new Date(date)),
        lte(
          purchaseOrders.date,
          new Date(new Date(date).setUTCHours(23, 59, 59, 999))
        )
      );
    }
  } else {
    if (!!date) {
      where = and(
        ilike(purchaseOrders.poNumber, search + "%"),
        gte(purchaseOrders.date, new Date(date)),
        lte(
          purchaseOrders.date,
          new Date(new Date(date).setUTCHours(23, 59, 59, 999))
        )
      );
    } else {
      where = ilike(purchaseOrders.poNumber, search + "%");
    }
  }

  try {
    const data = await db.query.purchaseOrders.findMany({
      where,
      limit,
      offset,
      with: {
        items: true,
        indent: true,
        seller: true,
      },
    });

    const totalC = await db
      .select({ count: count() })
      .from(purchaseOrders)
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

export const getPurchaseOrderById = (id: number) => {
  return db.query.purchaseOrders.findFirst({
    where: eq(purchaseOrders.id, id),
    with: {
      items: {
        item: true,
      },
      indent: true,
      seller: true,
    },
  });
};
