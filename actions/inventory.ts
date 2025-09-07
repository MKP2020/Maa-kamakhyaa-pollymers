"use server";
import { and, count, eq, gte, ilike, lte, sql } from "drizzle-orm";

import { getEndDate, getStartDate } from "@/lib/dates";
import { db } from "@/lib/db";
import { categories, tableList } from "@/lib/schema";
import { departments, inventory, TNewInventory } from "@/lib/schemas";

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

    // First, get the total quantities for each item
    const itemTotals = await db
      .select({
        itemId: inventory.itemId,
        totalInStock: sql<number>`SUM(${inventory.inStockQuantity})`,
        totalUsed: sql<number>`SUM(${inventory.usedQuantity})`,
        availableQuantity: sql<number>`SUM(${inventory.inStockQuantity} - ${inventory.usedQuantity})`,
        inventoryCount: sql<number>`COUNT(${inventory.id})`,
      })
      .from(inventory)
      .innerJoin(tableList, eq(tableList.id, inventory.itemId))
      .where(whereCond)
      .groupBy(inventory.itemId);

    // Create a map of item totals for quick lookup
    const totalsMap = new Map(
      itemTotals.map((t) => [
        t.itemId,
        {
          totalInStock: Number(t.totalInStock) || 0,
          totalUsed: Number(t.totalUsed) || 0,
          availableQuantity: Number(t.availableQuantity) || 0,
          inventoryCount: Number(t.inventoryCount) || 0,
        },
      ])
    );

    // Now get individual inventory records with item details
    const baseQuery = db
      .select({
        id: inventory.id,
        itemId: inventory.itemId,
        item: tableList,
        category: categories,
        department: departments,
        poItemId: inventory.poItemId,
        grnId: inventory.grnId,
        inStockQuantity: inventory.inStockQuantity,
        usedQuantity: inventory.usedQuantity,
        createdAt: inventory.createdAt,
        updatedAt: inventory.updatedAt,
      })
      .from(inventory)
      .innerJoin(tableList, eq(tableList.id, inventory.itemId))
      .leftJoin(categories, eq(categories.id, inventory.categoryId))
      .leftJoin(departments, eq(departments.id, inventory.departmentId))
      .where(whereCond);

    const rows = await (typeof limit === "number" && typeof offset === "number"
      ? (baseQuery as any).limit(limit).offset(offset)
      : typeof limit === "number"
      ? (baseQuery as any).limit(limit)
      : typeof offset === "number"
      ? (baseQuery as any).offset(offset)
      : baseQuery);

    const res = rows.map((r: any) => {
      const totals = totalsMap.get(r.itemId) || {
        totalInStock: 0,
        totalUsed: 0,
        availableQuantity: 0,
        inventoryCount: 0,
      };

      return {
        id: r.id,
        itemId: r.itemId,
        item: r.item,
        category: r.category,
        department: r.department,
        poItemId: r.poItemId,
        grnId: r.grnId,
        // Individual record quantities
        inStockQuantity: Number(r.inStockQuantity) || 0,
        usedQuantity: Number(r.usedQuantity) || 0,
        // Total quantities for the item (combined from all records)
        totalInStock: totals.totalInStock,
        totalUsed: totals.totalUsed,
        availableQuantity: totals.availableQuantity,
        inventoryCount: totals.inventoryCount,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });

    // Get total count for pagination (count of inventory records, not items)
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
    console.error("Error in getInventory:", error);
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
  return db
    .select({
      id: inventory.itemId, // Add id field for backward compatibility
      itemId: inventory.itemId,
      item: tableList,
      inStockQuantity: inventory.inStockQuantity,
      usedQuantity: inventory.usedQuantity,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
    })
    .from(inventory)
    .innerJoin(tableList, eq(tableList.id, inventory.itemId))
    .where(
      and(
        eq(inventory.categoryId, categoryId),
        eq(inventory.departmentId, departmentId)
      )
    )
    .then((rows) =>
      rows.map((r) => ({
        id: r.id, // For backward compatibility
        itemId: r.itemId,
        item: r.item,
        inStockQuantity: Number(r.inStockQuantity) || 0,
        usedQuantity: Number(r.usedQuantity) || 0,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }))
    );
};

// New function specifically for forms that returns aggregated data per item
export const getInventoryForForms = (
  categoryId: number,
  departmentId: number
) => {
  return db
    .select({
      id: inventory.itemId, // For backward compatibility
      itemId: inventory.itemId,
      item: tableList,
      totalInStock: sql<number>`SUM(${inventory.inStockQuantity})`,
      totalUsed: sql<number>`SUM(${inventory.usedQuantity})`,
      availableQuantity: sql<number>`SUM(${inventory.inStockQuantity} - ${inventory.usedQuantity})`,
    })
    .from(inventory)
    .innerJoin(tableList, eq(tableList.id, inventory.itemId))
    .where(
      and(
        eq(inventory.categoryId, categoryId),
        eq(inventory.departmentId, departmentId)
      )
    )
    .groupBy(inventory.itemId, tableList.id)
    .then((rows) =>
      rows.map((r) => ({
        id: r.id, // For backward compatibility
        itemId: r.itemId,
        item: r.item,
        totalInStock: Number(r.totalInStock) || 0,
        totalUsed: Number(r.totalUsed) || 0,
        availableQuantity: Number(r.availableQuantity) || 0,
      }))
    );
};
