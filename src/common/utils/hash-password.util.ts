import bcrypt from 'bcrypt';

/**
 * Hashes a password using the bcrypt algorithm.
 *
 * @param {string} password - The password to be hashed.
 * @return {Promise<string>} A Promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a password with a hashed password using the bcrypt algorithm.
 *
 * @param {string} originalPassword - The original password to be compared.
 * @param {string} hashedPassword - The hashed password to be compared against.
 * @returns {Promise<boolean>} A Promise that resolves to true if the passwords match,
 *                            or false if they do not match.
 */
export async function comparePassword(
  originalPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(originalPassword, hashedPassword);
}
