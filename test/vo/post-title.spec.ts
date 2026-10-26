import { DomainException } from '../../src/core/exception/domain/domain.exception';
import { PostTitle } from '../../src/modules/content/posts/domain/value-objects';

describe('PostTitle', () => {
  describe('valid', () => {
    it.each(['a', 'a'.repeat(30), 'Hello, world!', 'Мій перший пост'])(
      'accepts %s',
      (input) => {
        expect(PostTitle.create(input).value).toBe(input);
      },
    );

    it('trims spaces and keeps case', () => {
      expect(PostTitle.create('  User123 ').value).toBe('User123');
    });
  });

  describe('invalid', () => {
    it.each([
      ['too short', ''],
      ['too long', 'a'.repeat(31)],
      ['empty after trim', '   '],
    ])('rejects %s', (_, input) => {
      expect(() => PostTitle.create(input)).toThrow(DomainException);
    });

    it('does not throw TypeError on non-string input', () => {
      expect(() => PostTitle.create(undefined)).toThrow(DomainException);
      expect(() => PostTitle.create(123)).toThrow(DomainException);
    });
  });

  describe('equals', () => {
    it('same value → equal', () => {
      expect(
        PostTitle.create('user_1').equals(PostTitle.create(' user_1 ')),
      ).toBe(true);
    });
  });
});
