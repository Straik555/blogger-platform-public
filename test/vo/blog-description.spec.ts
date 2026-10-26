import { DomainException } from '../../src/core/exception/domain/domain.exception';
import { BlogDescription } from '../../src/modules/content/blogs/domain/value-objects';

describe('BlogDescription', () => {
  describe('valid', () => {
    it.each(['a', 'a'.repeat(500), 'Hello, world!', 'Мій перший пост'])(
      'accepts %s',
      (input) => {
        expect(BlogDescription.create(input).value).toBe(input);
      },
    );

    it('trims spaces and keeps case', () => {
      expect(BlogDescription.create('  User123 ').value).toBe('User123');
    });
  });

  describe('invalid', () => {
    it.each([
      ['too short', ''],
      ['too long', 'a'.repeat(501)],
      ['empty after trim', '   '],
    ])('rejects %s', (_, input) => {
      expect(() => BlogDescription.create(input)).toThrow(DomainException);
    });

    it('does not throw TypeError on non-string input', () => {
      expect(() => BlogDescription.create(undefined)).toThrow(DomainException);
      expect(() => BlogDescription.create(123)).toThrow(DomainException);
    });
  });

  describe('equals', () => {
    it('same value → equal', () => {
      expect(
        BlogDescription.create('user_1').equals(
          BlogDescription.create(' user_1 '),
        ),
      ).toBe(true);
    });
  });
});
