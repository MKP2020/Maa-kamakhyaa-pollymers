"use server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { TUser, getUserRole, type NewUser } from "@/lib/users";
import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const getAllUsers = async (): Promise<TUser[]> => {
  return db.query.users.findMany({ with: { department: true } });
};

export const createUser = async (
  newUser: Omit<NewUser, "clerkId"> & { password: string }
) => {
  "use server";
  const { password, role, firstName, lastName, email } = newUser;

  const alreadyExists = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  if (!!alreadyExists) {
    throw new Error("Email already exists");
  }

  const cResponse = await clerkClient.users.createUser({
    firstName: firstName,
    lastName: lastName,
    emailAddress: [email],

    password,
    publicMetadata: {
      role: getUserRole(role),
    },
    skipPasswordChecks: true,
  });

  const storedUser = await db
    .insert(users)
    .values({ role, firstName, lastName, email, clerkId: cResponse.id })
    .returning();

  return storedUser;
};

export const updateUser = async (
  newUser: Omit<NewUser, "clerkId"> & {
    id?: string;
    password: string;
    clerkId?: string;
  }
) => {
  "use server";
  const { password, role, id, firstName, lastName, email, clerkId } = newUser;

  const alreadyExists = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  if (!alreadyExists) {
    throw new Error("Email does not already exists");
  }

  const cResponse = await clerkClient.users.updateUser(clerkId!, {
    firstName: firstName,
    lastName: lastName,
    password,

    publicMetadata: {
      role: role,
    },
    skipPasswordChecks: true,
  });

  const storedUser = await db
    .update(users)
    .set({ role, firstName, lastName, email, clerkId: cResponse.id })
    .where(eq(users.id, id!))
    .returning();

  return storedUser;
};

export const getUserById = async (id: number): Promise<TUser | undefined> => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: { department: true },
    });
    return user;
  } catch (error) {
    return undefined;
  }
};
