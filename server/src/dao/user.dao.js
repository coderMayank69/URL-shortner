import prisma from "../config/prisma.client.js";
import bcrypt from "bcryptjs";

/**
 * Find a user by email (without password)
 */
export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

/**
 * Find a user by email and include the password field.
 * Used during login to compare passwords.
 */
export const findUserByEmailWithPassword = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
  // Note: Prisma doesn't have field-level select like Mongoose's .select('+password').
  // Password is always returned here; callers must handle it carefully.
};

/**
 * Find a user by their integer ID
 */
export const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      // password intentionally excluded for security
    },
  });
};

/**
 * Create a new user — hashes password before storing
 */
export const createUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
    },
  });
};

/**
 * Get all URLs belonging to a user
 */
export const getAllUserUrlsDao = async (userId) => {
  return await prisma.url.findMany({
    where: { userId: Number(userId) },
    orderBy: { createdAt: "desc" },
  });
};