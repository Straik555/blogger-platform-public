import { DomainException } from '../../src/core/exception/domain/domain.exception';
import { Email } from '../../src/modules/users/domain/value-objects/email';

describe('Email', () => {
  it('normalizes case and spaces', () => {
    expect(Email.create('  User@Mail.COM ').value).toBe('user@mail.com');
  });

  it('equals same email addresses', () => {
    expect(Email.create('a@b.com').equals(Email.create('A@B.com'))).toBe(true);
  });

  it.each(['', 'a@b', 'no-at-sign.com', 'a'.repeat(250) + '@b.com'])(
    'rejects invalid email: %s',
    (input) => {
      expect(() => Email.create(input)).toThrow(DomainException);
    },
  );

  it('does not throw TypeError on non-string input', () => {
    expect(() => Email.create(undefined)).toThrow(DomainException);
    expect(() => Email.create(123)).toThrow(DomainException);
  });
});
