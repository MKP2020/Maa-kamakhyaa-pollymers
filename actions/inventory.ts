"use server";
import { db } from "@/lib/db";
import { categories, purchaseOrderItems, tableList } from "@/lib/schema";
import { TNewInventory, departments, inventory } from "@/lib/schemas";
import { and, count, eq, gte, ilike, lte } from "drizzle-orm";

export const getInventory = async (
  search?: string,
  from?: string,
  to?: string,
  offset?: number,
  limit?: number
) => {
  let where: any = undefined;

  try {
    const res = await db.query.inventory.findMany({
      where: and(
        !from
          ? undefined
          : gte(
              inventory.createdAt,
              new Date(new Date(from).setHours(0, 0, 0, 0))
            ),
        !to
          ? undefined
          : lte(
              inventory.createdAt,
              new Date(new Date(to).setHours(23, 59, 59, 999))
            )
      ),
      with: {
        category: true,
        department: true,
        poItem: true,
        item: {
          where:
            (search || "").length === 0
              ? undefined
              : ilike(tableList.name, search + "%"),
        },
      },
      offset,
      limit,
    });

    const totalC = await db
      .select({ count: count() })
      .from(inventory)
      .innerJoin(tableList, eq(tableList.id, inventory.itemId))
      .where(
        and(
          (search || "").length === 0
            ? undefined
            : ilike(tableList.name, search + "%"),
          !from
            ? undefined
            : gte(
                inventory.createdAt,
                new Date(new Date(from).setHours(0, 0, 0, 0))
              ),
          !to
            ? undefined
            : lte(
                inventory.createdAt,
                new Date(new Date(to).setHours(23, 59, 59, 999))
              )
        )
      );

    return {
      data: res.filter((d) => !!d.item),
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
      item: true,
      poItem: { with: { item: true } },
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
      item: true,
      poItem: { with: { item: true } },
    },
  });
};
