import bcrypt from "bcryptjs";
import { findUserByEmail, findUserByEmailWithPassword, createUser } from "../dao/user.dao.js";
import { ConflictError, UnauthorizedError } from "../utils/errorHandler.js";
import { signToken } from "../utils/helper.js";

/**
 * Register a new user.
 * Throws ConflictError if email is already taken.
 */
export const registerUser = async (name, email, password) => {
  const existing = await findUserByEmail(email);
  if (existing) throw new ConflictError("User already exists");

  // createUser hashes the password internally
  const user = await createUser(name, email, password);
  const token = signToken({ id: user.id });
  return { token, user };
};

/**
 * Log in an existing user.
 * Throws UnauthorizedError on bad credentials (generic message to prevent user enumeration).
 */
export const loginUser = async (email, password) => {
  // Need full user record including password for comparison
  const user = await findUserByEmailWithPassword(email);
  if (!user) throw new UnauthorizedError("Invalid email or password");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new UnauthorizedError("Invalid email or password");

  // Strip password before returning user object
  const { password: _pass, ...safeUser } = user;

  const token = signToken({ id: safeUser.id });
  return { token, user: safeUser };
};
