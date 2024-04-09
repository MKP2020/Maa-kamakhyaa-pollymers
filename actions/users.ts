"use server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { getUserRole, type NewUser } from "@/lib/users";
import { clerkClient } from "@clerk/nextjs";

export const getAllUsers = async (): Promise<NewUser[]> => {
  return db.query.users.findMany();
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
