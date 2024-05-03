"use server";

import { db } from "@/lib/db";
import { TVendorsFull, addresses, bankDetails, vendors } from "@/lib/schema";
import { and, count, eq, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getVendors = async (
  limit: number,
  offset: number,
  from?: string,
  to?: string
) => {
  const total = await db.select({ count: count() }).from(vendors);

  // const query = db.select().from(vendors);

  // if (from && !to) {
  //   query.where(gte(vendors.createdAt, new Date(from)));
  // } else if (to && !from) {
  //   query.where(lte(vendors.createdAt, new Date(to)));
  // } else if (!!to && !!from) {
  //   query.where(
  //     and(
  //       gte(vendors.createdAt, new Date(from)),
  //       lte(vendors.createdAt, new Date(to))
  //     )
  //   );
  // }
  const response = await db.query.vendors.findMany({
    where: !(!!to && !!from)
      ? undefined
      : (vendors, { gte, lte, and }) =>
          from && !to
            ? gte(vendors.createdAt, new Date(from))
            : to && !from
            ? lte(vendors.createdAt, new Date(to))
            : and(
                gte(vendors.createdAt, new Date(from)),
                lte(vendors.createdAt, new Date(to))
              ),
    with: { address: true, bankDetails: true, category: true },
    limit: limit,
    offset,
  });
  // query.fullJoin(bankDetails, eq(bankDetails.id, vendors.bankDetailsId));
  // query.limit(10);
  // query.offset(page * 10);
  // const response = await query;

  return {
    total: total[0].count,
    data: response,
  };
};

type TNewVendor = {
  email: string;
  name: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  addressLine1: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  contactNumber: string;
  category: string;
  type: string;
  addressLine2?: string | undefined;
  categoryId: string;
  gstNumber: string;
  pan: string;
};

export const createVendor = async (newVendor: TNewVendor) => {
  "use server";
  const {
    state,
    city,
    district,
    pinCode,
    addressLine1,
    addressLine2,
    accountNumber,
    ifsc,
    branch,
    type,
    category,
    name,
    contactNumber,
    email,
    gstNumber,
    pan,
  } = newVendor;
  const newAddress = await db
    .insert(addresses)
    .values({
      state: state,
      city: city,
      district: district,
      pinCode: pinCode,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
    })
    .returning();

  const newBankingDetails = await db
    .insert(bankDetails)
    .values({
      accountNumber: accountNumber,
      ifsc: ifsc,
      branch: branch,
    })
    .returning();

  const newSavedVendor = await db.insert(vendors).values({
    name,
    contactNumber,
    emailId: email,
    categoryId: parseInt(category),
    addressId: newAddress[0].id,
    bankDetailsId: newBankingDetails[0].id,
    gstNumber,
    pan,
  });
};

export const getVendorById = async (vendorId: number) => {
  "use server";
  return db.query.vendors.findFirst({
    where: eq(vendors.id, vendorId),
    with: {
      category: true,
      address: true,
      bankDetails: true,
    },
  });
};
export const deleteVendor = async (vendorId: number) => {
  "use server";
  const deletedVendor = await db
    .delete(vendors)
    .where(eq(vendors.id, vendorId))
    .returning();
  await db
    .delete(bankDetails)
    .where(eq(bankDetails.id, deletedVendor[0].bankDetailsId));
  await db
    .delete(addresses)
    .where(eq(addresses.id, deletedVendor[0].addressId));
  revalidatePath("/");
};
