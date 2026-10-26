import { DomainException } from '../../src/core/exception/domain/domain.exception';
import { BlogName } from '../../src/modules/content/blogs/domain/value-objects';

describe('BlogName', () => {
  describe('valid', () => {
    it.each(['a', 'a'.repeat(15), 'Hello, world!', 'Мій перший пост'])(
      'accepts %s',
      (input) => {
        expect(BlogName.create(input).value).toBe(input);
      },
    );

    it('trims spaces and keeps case', () => {
      expect(BlogName.create('  User123 ').value).toBe('User123');
    });
  });

  describe('invalid', () => {
    it('rejects empty string', () => {
      expect(() => BlogName.create('')).toThrow(DomainException);
    });

    it('does not throw TypeError on non-string input', () => {
      expect(() => BlogName.create(undefined)).toThrow(DomainException);
      expect(() => BlogName.create(123)).toThrow(DomainException);
    });
  });

  describe('equals', () => {
    it('same value → equal', () => {
      expect(
        BlogName.create('user_1').equals(BlogName.create(' user_1 ')),
      ).toBe(true);
    });
  });
});
