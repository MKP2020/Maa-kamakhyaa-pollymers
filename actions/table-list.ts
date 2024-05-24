"use server";

import { db } from "@/lib/db";
import {
  TNewTableList,
  TTableList,
  TTableListFull,
  tableList,
} from "@/lib/schema";
import { count, eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getTableList = async (
  offset: number,
  limit: number,
  search?: string | null
): Promise<{ data: TTableListFull[]; total: number }> => {
  const countQuery = db.select({ count: count() }).from(tableList);

  if (!!search) {
    countQuery.where(ilike(tableList.name, search + "%"));
  }

  const res = await db.query.tableList.findMany({
    where(fields, { ilike }) {
      if (!search) return undefined;
      return ilike(fields.name, search + "%");
    },
    offset,
    limit,
    with: { category: true },
  });
  const listCount = await countQuery;

  return { data: res, total: listCount[0].count };
};

export const getTableListByCategory = async (id: number) => {
  return db.query.tableList.findMany({
    where: eq(tableList.categoryId, id),
  });
};

export const createTableListItem = async (item: TNewTableList) => {
  const exists = await db
    .select()
    .from(tableList)
    .where(eq(tableList.name, item.name));

  if (exists.length > 0) {
    throw new Error("item name already exists");
  }

  const data = await db.insert(tableList).values(item).returning();
  return data;
};

export const deleteTableList = async (id: number) => {
  await db.delete(tableList).where(eq(tableList.id, id)).returning();
  revalidatePath("/");
};
