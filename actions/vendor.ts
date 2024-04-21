"use server";

import { db } from "@/lib/db";
import { TVendorsFull, addresses, bankDetails, vendors } from "@/lib/schema";
import { count } from "drizzle-orm";

export const getVendors = async () => {
  const total = await db.select({ count: count() }).from(vendors);
  const response = await db.query.vendors.findMany({
    with: {
      category: true,
      address: true,
      bankDetails: true,
    },
  });

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
