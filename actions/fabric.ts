"use server";

import { db } from "@/lib/db";
import { fabrics } from "@/lib/schema";
import { count, desc, eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getFabrics = async (
  offset: number,
  limit: number,
  search: string
) => {
  try {
    const data = await db.query.fabrics.findMany({
      offset,
      limit,
      where(fields, operators) {
        if (!!search && search.length > 0) {
          return operators.ilike(fields.grade, search + "%");
        }
        return undefined;
      },
      orderBy: desc(fabrics.createdAt),
    });

    const countData = await db
      .select({ count: count() })
      .from(fabrics)
      .where(
        (search || "").length === 0
          ? undefined
          : ilike(fabrics.grade, search + "%")
      );

    return { data, total: countData[0].count };
  } catch (error) {
    return { data: [], total: 0 };
  }
};

export const createFabric = async (grade: string) => {
  const exists = await db
    .select()
    .from(fabrics)
    .where(ilike(fabrics.grade, grade));
  if (exists.length > 0) {
    throw new Error("Fabric grade already exists");
  }
  return db.insert(fabrics).values({ grade }).returning();
};

export const updateFabric = (id: number, grade: string) => {
  return db
    .update(fabrics)
    .set({ grade })
    .where(eq(fabrics.id, id))
    .returning();
};

export const deleteFabric = async (id: number, invalidate?: boolean) => {
  try {
    await db.delete(fabrics).where(eq(fabrics.id, id)).returning();
    if (invalidate) {
      revalidatePath("/");
    }
  } catch (error) {
    throw error;
  }
};

export const getFabricById = async (id: number) => {
  try {
    const data = await db.select().from(fabrics).where(eq(fabrics.id, id));

    return { data: data[0] };
  } catch (error) {
    return { data: null };
  }
};
