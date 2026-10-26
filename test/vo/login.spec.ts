import { DomainException } from '../../src/core/exception/domain/domain.exception';
import { Login } from '../../src/core/value-objects';

describe('Login', () => {
  describe('valid', () => {
    it.each(['abc', 'abcdefghij', 'user_1', 'my-name', 'User123'])(
      'accepts %s',
      (input) => {
        expect(Login.create(input).value).toBe(input);
      },
    );

    it('trims spaces and keeps case', () => {
      expect(Login.create('  User123 ').value).toBe('User123');
    });
  });

  describe('invalid', () => {
    it.each([
      ['too short', 'ab'],
      ['too long', 'abcdefghijk'],
      ['empty after trim', '   '],
      ['space inside', 'ab cd'],
      ['@ symbol', 'ab@cd'],
      ['cyrillic', 'юзер'],
    ])('rejects %s: "%s"', (_, input) => {
      expect(() => Login.create(input)).toThrow(DomainException);
    });

    it('does not throw TypeError on non-string input', () => {
      expect(() => Login.create(undefined)).toThrow(DomainException);
      expect(() => Login.create(123)).toThrow(DomainException);
    });
  });

  describe('equals', () => {
    it('same value → equal', () => {
      expect(Login.create('user_1').equals(Login.create(' user_1 '))).toBe(
        true,
      );
    });

    it('different case → NOT equal', () => {
      expect(Login.create('Vitalii').equals(Login.create('vitalii'))).toBe(
        false,
      );
    });
  });
});
