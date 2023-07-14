import { z } from 'zod';

/**
 * Parse number to uint or throw error
 * @param str String to parse
 * @returns {number} Parsed number
 * @throws {ZodError}
 */
export const parseToUint = (str: string): number => {
  return z.coerce.number().min(0).parse(str);
};

export const isDebug = () => {
  return process.env.DEBUG === 'true';
};
