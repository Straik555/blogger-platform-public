import { randomUUID } from 'crypto';

/** Valid UUID that does not exist in the database — use for 404 checks. */
export const nonExistentId = (): string => randomUUID();

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Refresh tokens are compared by `iat` (seconds), so rotation needs > 1s gap. */
export const waitNextSecond = (): Promise<void> => delay(1100);

/** Reads `refreshToken` value from the Set-Cookie header of a response. */
export const extractRefreshToken = (setCookie: unknown): string => {
  const cookies = Array.isArray(setCookie) ? (setCookie as string[]) : [];
  const cookie = cookies.find((c) => c.startsWith('refreshToken='));
  if (!cookie) {
    throw new Error('refreshToken cookie was not set');
  }
  return cookie.split(';')[0].split('=')[1];
};

export const refreshCookie = (refreshToken: string): string =>
  `refreshToken=${refreshToken}`;

/** Reads deviceId from the refresh token payload (no signature check). */
export const deviceIdFromRefreshToken = (refreshToken: string): string => {
  const payload = JSON.parse(
    Buffer.from(refreshToken.split('.')[1], 'base64url').toString('utf-8'),
  ) as { deviceId: string };
  return payload.deviceId;
};

export type ParsedCookie = {
  name: string;
  value: string;
  attributes: string[];
};

/**
 * Splits the single Set-Cookie header into name, value and attributes:
 * "refreshToken=<jwt>; Path=/; HttpOnly; Secure"
 *   → { name: 'refreshToken', value: '<jwt>', attributes: ['Path=/', 'HttpOnly', 'Secure'] }
 */
export const parseSetCookie = (setCookie: unknown): ParsedCookie[] => {
  const cookies = Array.isArray(setCookie) ? (setCookie as string[]) : [];
  return cookies.map((cookie) => {
    const [pair, ...attributes] = cookie.split(';').map((part) => part.trim());
    const separator = pair.indexOf('=');
    return {
      name: pair.slice(0, separator),
      value: pair.slice(separator + 1),
      attributes,
    };
  });
};

/** JWT = three base64url parts separated by dots. */
export const JWT_REGEX = /^[\w-]+\.[\w-]+\.[\w-]+$/;
