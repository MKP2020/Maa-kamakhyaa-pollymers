"use server";
import { db } from "@/lib/db";
import { TNewInventory, inventory } from "@/lib/schemas";
import { and, count, eq, gte, ilike, lte } from "drizzle-orm";

export const getInventory = async (
  search?: string,
  date?: string,
  offset?: number,
  limit?: number
) => {
  let where: any = undefined;

  if ((search || "").length === 0) {
    if (!!date) {
      where = and(
        gte(inventory.createdAt, new Date(date)),
        lte(
          inventory.createdAt,
          new Date(new Date(date).setUTCHours(23, 59, 59, 999))
        )
      );
    }
  } else {
    if (!!date) {
      where = and(
        ilike(inventory.itemId, "%" + search + "%"),
        gte(inventory.createdAt, new Date(date)),
        lte(
          inventory.createdAt,
          new Date(new Date(date).setUTCHours(23, 59, 59, 999))
        )
      );
    } else {
      where = ilike(inventory.itemId, "%" + search + "%");
    }
  }

  try {
    const data = await db.query.inventory.findMany({
      where,
      limit,
      offset,
      with: {
        item: { with: { item: { with: { item: true } } } },
        department: true,
        category: true,
      },
    });

    const totalC = await db
      .select({ count: count() })
      .from(inventory)
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

export const getInventoryById = (id: number) => {
  return db.query.inventory.findFirst({
    where: eq(inventory.id, id),
    with: {
      category: true,
      item: { with: { item: { with: { item: true } } } },
      department: true,
    },
  });
};

export const createInventory = (data: TNewInventory) => {
  return db.insert(inventory).values(data).returning();
};

export const getInventoryBy = (categoryId: number, departmentId: number) => {
  return db.query.inventory.findMany({
    where: and(
      eq(inventory.categoryId, categoryId),
      eq(inventory.departmentId, departmentId)
    ),
    with: {
      item: {
        with: {
          item: { with: { item: true } },
        },
      },
    },
  });
};
