import { isIP } from 'node:net';

export class Ip {
  static readonly MAX_LENGTH = 255;
  static readonly DEFAULT = 'unknown';
  private static readonly IPV4_MAPPED_PREFIX = '::ffff:';
  private constructor(public readonly value: string) {}

  static create(value: unknown): Ip {
    const trimmed = typeof value === 'string' ? value.trim() : '';
    const normalized =
      trimmed.toLowerCase().startsWith(Ip.IPV4_MAPPED_PREFIX) &&
      isIP(trimmed.slice(Ip.IPV4_MAPPED_PREFIX.length)) === 4
        ? trimmed.slice(Ip.IPV4_MAPPED_PREFIX.length)
        : trimmed;

    const ip = isIP(normalized) !== 0 ? normalized : Ip.DEFAULT;

    return new Ip(ip.slice(0, Ip.MAX_LENGTH));
  }

  static fromPersistence(value: string): Ip {
    return new Ip(value);
  }
  equals(other: Ip): boolean {
    return this.value === other.value;
  }
  toString(): string {
    return this.value;
  }
}
