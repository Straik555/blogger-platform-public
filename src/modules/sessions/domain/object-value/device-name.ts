export class DeviceName {
  static readonly MAX_LENGTH = 255;
  static readonly DEFAULT = 'Unknown device';
  private constructor(public readonly value: string) {}
  static create(value: unknown): DeviceName {
    const trimmed = typeof value === 'string' ? value.trim() : '';
    const name = trimmed.length > 0 ? trimmed : DeviceName.DEFAULT;
    return new DeviceName(name.slice(0, DeviceName.MAX_LENGTH));
  }

  static fromPersistence(value: string): DeviceName {
    return new DeviceName(value);
  }

  equals(other: DeviceName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
