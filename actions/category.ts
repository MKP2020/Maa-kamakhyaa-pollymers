"use server";
import { db } from "@/lib/db";
import { TCategory, categories, users } from "@/lib/schema";
import { count, ilike, like, sql } from "drizzle-orm";

export const getCategories = async (
  offset: number,
  limit: number,
  search?: string | null
): Promise<{ data: TCategory[]; total: number }> => {
  const query = db.select().from(categories);

  console.log("search", search);
  if (!!search) {
    query.where(ilike(categories.name, search + "%"));
  }

  query
    .limit(limit) // the number of rows to return
    .offset(offset);

  const res = await query;
  const categoriesCount = await db.select({ count: count() }).from(categories);

  return { data: res, total: categoriesCount[0].count };
};
