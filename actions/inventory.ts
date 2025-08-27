"use server";
import { and, count, eq, gte, ilike, lte } from 'drizzle-orm';

import { getEndDate, getStartDate } from '@/lib/dates';
import { db } from '@/lib/db';
import { categories, purchaseOrderItems, tableList } from '@/lib/schema';
import { departments, inventory, TNewInventory } from '@/lib/schemas';

export const getInventory = async (
  search?: string,
  from?: string,
  to?: string,
  offset?: number,
  limit?: number
) => {
  try {
    const hasSearch = (search || "").trim().length > 0;

    const whereCond = and(
      !from ? undefined : gte(inventory.createdAt, getStartDate(from)),
      !to ? undefined : lte(inventory.createdAt, getEndDate(to)),
      !hasSearch ? undefined : ilike(tableList.name, `%${search}%`)
    );

    const baseQuery = db
      .select({
        inventory,
        item: tableList,
        category: categories,
        department: departments,
        poItem: purchaseOrderItems,
      })
      .from(inventory)
      .innerJoin(tableList, eq(tableList.id, inventory.itemId))
      .leftJoin(categories, eq(categories.id, inventory.categoryId))
      .leftJoin(departments, eq(departments.id, inventory.departmentId))
      .leftJoin(
        purchaseOrderItems,
        eq(purchaseOrderItems.id, inventory.poItemId)
      )
      .where(whereCond);

    const rows = await (typeof limit === "number" && typeof offset === "number"
      ? (baseQuery as any).limit(limit).offset(offset)
      : typeof limit === "number"
      ? (baseQuery as any).limit(limit)
      : typeof offset === "number"
      ? (baseQuery as any).offset(offset)
      : baseQuery);

    const res = rows.map((r: any) => ({
      ...r.inventory,
      item: r.item,
      category: r.category,
      department: r.department,
      poItem: r.poItem as any,
    }));

    const totalC = await db
      .select({ count: count() })
      .from(inventory)
      .innerJoin(tableList, eq(tableList.id, inventory.itemId))
      .where(whereCond);

    return {
      data: res,
      total: totalC[0]?.count ?? 0,
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
