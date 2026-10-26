import { DomainException } from '../../src/core/exception/domain/domain.exception';
import { PostContent } from '../../src/modules/content/posts/domain/value-objects';

describe('PostContent', () => {
  describe('valid', () => {
    it.each([
      ['min length (1)', 'a'],
      ['max length (1000)', 'a'.repeat(1000)],
      ['multiline text', 'Line one\nLine two'],
      ['cyrillic', 'Текст поста українською'],
    ])('accepts %s', (_, input) => {
      expect(PostContent.create(input).value).toBe(input);
    });

    it('stores trimmed value', () => {
      expect(PostContent.create('  body  ').value).toBe('body');
    });
  });

  describe('invalid', () => {
    it.each([
      ['empty', ''],
      ['only spaces', '   '],
      ['too long (1001)', 'a'.repeat(1001)],
    ])('rejects %s', (_, input) => {
      expect(() => PostContent.create(input)).toThrow(DomainException);
    });

    it('does not throw TypeError on non-string input', () => {
      expect(() => PostContent.create(undefined)).toThrow(DomainException);
      expect(() => PostContent.create(123)).toThrow(DomainException);
    });
  });

  it('equals by value after trim', () => {
    expect(
      PostContent.create('body').equals(PostContent.create(' body ')),
    ).toBe(true);
  });
});
