"use server";

import { db } from "@/lib/db";
import { departments } from "@/lib/schema";
import { count, desc, eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getDepartments = async (
  offset?: number,
  limit?: number,
  search?: string
) => {
  try {
    const data = await db.query.departments.findMany({
      offset,
      limit,
      where(fields, operators) {
        if (!!search && search.length > 0) {
          return operators.ilike(fields.name, search + "%");
        }
        return undefined;
      },
      orderBy: desc(departments.createdAt),
    });

    const countData = await db
      .select({ count: count() })
      .from(departments)
      .where(
        (search || "").length == 0
          ? undefined
          : ilike(departments.name, search + "%")
      );

    return { data, total: countData[0].count };
  } catch (error) {
    return { data: [], total: 0 };
  }
};

export const createDepartment = async (name: string) => {
  const exists = await db
    .select()
    .from(departments)
    .where(ilike(departments.name, name));
  if (exists.length > 0) {
    throw new Error("Department name already exists");
  }
  return db.insert(departments).values({ name }).returning();
};

export const updateDepartment = (id: number, name: string) => {
  return db
    .update(departments)
    .set({ name })
    .where(eq(departments.id, id))
    .returning();
};

export const deleteDepartment = async (id: number, invalidate?: boolean) => {
  try {
    await db.delete(departments).where(eq(departments.id, id)).returning();
    if (invalidate) {
      revalidatePath("/");
    }
  } catch (error) {
    throw error;
  }
};

export const getDepartmentById = async (id: number) => {
  try {
    const data = await db
      .select()
      .from(departments)
      .where(eq(departments.id, id));

    return { data: data[0] };
  } catch (error) {
    return { data: null };
  }
};
