import bcrypt from "bcryptjs";

/**
 * Hash a plain-text password using bcrypt.
 * @param {string} password - The plain password from user input.
 * @returns {Promise<string>} - The hashed password.
 */
export const hashPassword = async (password) => {
  if (!password) throw new Error("Password is required");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

/**
 * Compare a plain password with a hashed password.
 * @param {string} password - The plain password entered by the user.
 * @param {string} hashedPassword - The stored hashed password.
 * @returns {Promise<boolean>} - True if the password matches.
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
