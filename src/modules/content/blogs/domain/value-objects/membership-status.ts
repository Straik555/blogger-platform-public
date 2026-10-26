export class MembershipStatus {
  private constructor(public readonly value: boolean) {}

  static create(value: boolean = false): MembershipStatus {
    return new MembershipStatus(value);
  }

  static default(): MembershipStatus {
    return new MembershipStatus(false);
  }
}
