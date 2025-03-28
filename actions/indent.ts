"use server";
import { getYear } from "date-fns";
import { and, count, eq, gte, lte } from "drizzle-orm";

import { db } from "@/lib/db";
import { indentItems, indentNumbers, indents } from "@/lib/schema";
import { TIndentItem, TNewIndent, TNewIndentItem } from "@/lib/types";

export const createIndent = async (
  newIndent: TNewIndent,
  items: TNewIndentItem[]
) => {
  try {
    const year = getYear(newIndent.date!);

    const count = await db.query.indentNumbers.findFirst({
      where: eq(indentNumbers.year, year),
    });

    let indentNumber = newIndent.indentNumber;

    if (!count) {
      indentNumber += "1";
    } else {
      indentNumber += count.currentCount + 1;
    }

    const res = await db
      .insert(indents)
      .values({
        departmentId: newIndent.departmentId,
        date: newIndent.date,
        categoryId: newIndent.categoryId,
        indentNumber,
      })
      .returning();

    const indent = res[0];

    if (!count) {
      await db.insert(indentNumbers).values({ currentCount: 1, year });
    } else {
      await db
        .update(indentNumbers)
        .set({ currentCount: (count?.currentCount || 0) + 1 })
        .where(eq(indentNumbers.year, year));
    }
    if (indent) {
      const itemList: TIndentItem[] = [];

      for (let index = 0; index < items.length; index++) {
        const element = items[index];

        const nRes = await db
          .insert(indentItems)
          .values({
            ...element,
            indentId: indent.id,
          })
          .returning();
        itemList.push(nRes[0]);
      }

      return {
        ...indent,
        items: itemList,
      };
    }
    throw new Error("failed to create indent");
  } catch (error) {
    throw error;
  }
};

export const updateIndentApprovedQuantities = async (
  items: { id: number; approvedQty: number | null }[]
) => {
  for (let index = 0; index < items.length; index++) {
    const element = items[index];
    await db
      .update(indentItems)
      .set({ approvedQty: element.approvedQty })
      .where(eq(indentItems.id, element.id));
  }
};

export const getIndents = async (
  search?: string,
  from?: string,
  to?: string,
  offset?: number,
  limit?: number
) => {
  try {
    const data = await db.query.indents.findMany({
      offset,
      limit,
      where(fields) {
        const hasSearch = !!search && search.length > 0;

        if (hasSearch && !from && !to) {
          return eq(fields.indentNumber, search!);
        }

        if (hasSearch && !!from && !!to) {
          return and(
            eq(fields.indentNumber, search),
            gte(fields.date, new Date(from)),
            lte(fields.date, new Date(to))
          );
        }

        if (hasSearch && !!from && !to) {
          return and(
            eq(fields.indentNumber, search),
            gte(fields.date, new Date(from))
          );
        }

        if (hasSearch && !from && !!to) {
          return and(
            eq(fields.indentNumber, search),
            lte(fields.date, new Date(to))
          );
        }

        if (from && !to) {
          return gte(fields.date, new Date(from));
        }

        if (to && !from) {
          return lte(fields.date, new Date(to));
        }

        if (!!from && !!to) {
          return and(
            gte(fields.date, new Date(from)),
            lte(fields.date, new Date(to))
          );
        }

        return undefined;
      },
      with: {
        items: {
          with: {
            item: true,
          },
        },
        department: true,
        category: true,
      },
      //   orderBy: desc(departments.createdAt),
    });
    const countData = await db
      .select({ count: count() })
      .from(indents)
      .where(
        !!search && search.length > 0 && !from && !to
          ? eq(indents.indentNumber, search)
          : !!search && search.length > 0 && !!from && !!to
          ? and(
              eq(indents.indentNumber, search),
              gte(indents.date, new Date(from)),
              lte(indents.date, new Date(to))
            )
          : !!search && search.length > 0 && !!from && !to
          ? and(
              eq(indents.indentNumber, search),
              gte(indents.date, new Date(from))
            )
          : !!search && search.length > 0 && !from && !!to
          ? and(
              eq(indents.indentNumber, search),
              lte(indents.date, new Date(to))
            )
          : from && !to
          ? gte(indents.date, new Date(from))
          : to && !from
          ? lte(indents.date, new Date(to))
          : !!from && !!to
          ? and(
              gte(indents.date, new Date(from)),
              lte(indents.date, new Date(to))
            )
          : undefined
      );

    return { data, total: countData[0].count };
  } catch (error) {
    return { data: [], total: 0 };
  }
};

export const getIndentById = async (id: number) => {
  return db.query.indents.findFirst({
    where: eq(indents.id, id),
    with: {
      items: {
        with: {
          item: true,
        },
      },
      department: true,
      category: true,
    },
  });
};
