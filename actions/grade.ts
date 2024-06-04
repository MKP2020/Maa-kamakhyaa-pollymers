"use server";

import { db } from "@/lib/db";
import { grades } from "@/lib/schema";
import { GRADES_TYPES } from "@/lib/utils";
import { count, desc, eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createQuantity } from "./quantity";

export const getGrades = async (
  offset?: number,
  limit?: number,
  search?: string
) => {
  try {
    const data = await db.query.grades.findMany({
      offset,
      limit,
      where:
        (search || "").length === 0
          ? undefined
          : ilike(grades.grade, search + "%"),
      orderBy: desc(grades.createdAt),
    });

    const countData = await db
      .select({ count: count() })
      .from(grades)
      .where(
        (search || "").length === 0
          ? undefined
          : ilike(grades.grade, search + "%")
      );

    return { data, total: countData[0].count };
  } catch (error) {
    return { data: [], total: 0 };
  }
};

export const getGradesByType = async (type: GRADES_TYPES) => {
  try {
    const data = await db.query.grades.findMany({
      where: eq(grades.type, type),
      orderBy: desc(grades.createdAt),
    });

    return { data };
  } catch (error) {
    return { data: [] };
  }
};

export const createGrade = async (type: number, grade: string) => {
  const exists = await db
    .select()
    .from(grades)
    .where(ilike(grades.grade, grade));

  if (exists.length > 0) {
    throw new Error("grade already exists");
  }
  const res = await db.insert(grades).values({ type, grade }).returning();
  await createQuantity(res[0].id);
  return res[0];
};

export const updateGrade = (id: number, grade: string) => {
  return db.update(grades).set({ grade }).where(eq(grades.id, id)).returning();
};

export const deleteGrade = async (id: number, invalidate?: boolean) => {
  try {
    await db.delete(grades).where(eq(grades.id, id)).returning();
    if (invalidate) {
      revalidatePath("/");
    }
  } catch (error) {
    throw error;
  }
};

export const getGradeById = async (id: number) => {
  try {
    const data = await db.select().from(grades).where(eq(grades.id, id));

    return { data: data[0] };
  } catch (error) {
    return { data: null };
  }
};

export const getGradesByTypeWithQuantity = async (type: GRADES_TYPES) => {
  try {
    const data = await db.query.grades.findMany({
      where: eq(grades.type, type),
      orderBy: desc(grades.createdAt),
      with: {
        quantity: true,
      },
    });

    return { data };
  } catch (error) {
    return { data: [] };
  }
};
