"use server";

import { db } from "@/lib/db";
import {
  purchaseOrderItems,
  purchaseOrderNumbers,
  purchaseOrders,
} from "@/lib/schema";
import {
  TNewPurchaseOrder,
  TNewPurchaseOrderItem,
  TPurchaseOrder,
  TPurchaseOrderItem,
} from "@/lib/types";
import { getYear } from "date-fns";
import { and, count, eq, not, gte, ilike, lte } from "drizzle-orm";

export const getPurchaseOrders = async (
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
        gte(purchaseOrders.date, new Date(new Date(from).setHours(0, 0, 0, 0))),
        lte(
          purchaseOrders.date,
          new Date(new Date(to).setHours(23, 59, 59, 999))
        )
      );
    } else if (!!from && !to) {
      where = gte(
        purchaseOrders.date,
        new Date(new Date(from).setHours(0, 0, 0, 0))
      );
    } else if (!from && !!to) {
      where = gte(
        purchaseOrders.date,
        new Date(new Date(to).setHours(23, 59, 59, 999))
      );
    }
  } else {
    if (!!from && !!to) {
      where = and(
        ilike(purchaseOrders.poNumber, search + "%"),
        gte(purchaseOrders.date, new Date(new Date(from).setHours(0, 0, 0, 0))),
        lte(
          purchaseOrders.date,
          new Date(new Date(to).setHours(23, 59, 59, 999))
        )
      );
    } else if (!!from && !to) {
      where = and(
        ilike(purchaseOrders.poNumber, search + "%"),
        gte(purchaseOrders.date, new Date(new Date(from).setHours(0, 0, 0, 0)))
      );
    } else if (!from && !!to) {
      where = and(
        ilike(purchaseOrders.poNumber, search + "%"),
        gte(
          purchaseOrders.date,
          new Date(new Date(to).setHours(23, 59, 59, 999))
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
      orderBy: purchaseOrders.id,
      with: {
        items: { with: { item: { with: { item: true } } } },
        indent: { with: { department: true } },
        seller: {
          with: {
            address: true,
          },
        },
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
      items: { with: { item: { with: { item: true } } } },
      indent: true,
      seller: true,
    },
  });
};

type TCreateNewPurchaseOrderItem = Omit<TNewPurchaseOrderItem, "id" | "poId">;

export const createPurchaseOrder = async (
  newOrder: TNewPurchaseOrder,
  items: TCreateNewPurchaseOrderItem[]
) => {
  try {
    const year = getYear(newOrder.date!);

    const count = await db.query.purchaseOrderNumbers.findFirst({
      where: eq(purchaseOrderNumbers.year, year),
    });

    let poNumber = newOrder.poNumber;

    if (!count) {
      poNumber += "1";
    } else {
      poNumber += count.currentCount + 1;
    }

    const res = await db
      .insert(purchaseOrders)
      .values({
        ...newOrder,
        poNumber,
      })
      .returning();

    const newPO = res[0];

    if (!count) {
      await db.insert(purchaseOrderNumbers).values({ currentCount: 1, year });
    } else {
      await db
        .update(purchaseOrderNumbers)
        .set({ currentCount: (count?.currentCount || 0) + 1 })
        .where(eq(purchaseOrderNumbers.year, year));
    }

    if (newPO) {
      const itemList: TPurchaseOrderItem[] = [];

      for (let index = 0; index < items.length; index++) {
        const element = items[index];

        const nRes = await db
          .insert(purchaseOrderItems)
          .values({
            ...element,

            poId: newPO.id,
          })
          .returning();
        itemList.push(nRes[0]);
      }

      return {
        ...newPO,
        items: itemList,
      };
    }
    throw new Error("failed to create indent");
  } catch (error) {
    throw error;
  }
};

export const updatePurchaseOrder = (
  id: number,
  values: { status?: number; approvalStatus?: number }
) => {
  return db
    .update(purchaseOrders)
    .set(values)
    .where(eq(purchaseOrders.id, id))
    .returning();
};

export const getPendingPurchaseOrders = async () => {
  return db.query.purchaseOrders.findMany({
    where: eq(purchaseOrders.status, 0),
  });
};

export const getPurchaseOrderItems = (poId: number) => {
  return db.query.purchaseOrderItems.findMany({
    where: eq(purchaseOrderItems.poId, poId),
    with: {
      item: {
        with: { item: true, indent: true },
      },
    },
  });
};
