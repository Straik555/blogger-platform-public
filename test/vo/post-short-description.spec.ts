import { DomainException } from '../../src/core/exception/domain/domain.exception';
import { PostShortDescription } from '../../src/modules/content/posts/domain/value-objects';

describe('PostShortDescription', () => {
  describe('valid', () => {
    it.each([
      ['min length (1)', 'a'],
      ['max length (100)', 'a'.repeat(100)],
      ['text with punctuation', 'Short intro, with commas!'],
      ['cyrillic', 'Короткий опис поста'],
    ])('accepts %s', (_, input) => {
      expect(PostShortDescription.create(input).value).toBe(input);
    });

    it('stores trimmed value', () => {
      expect(PostShortDescription.create('  intro  ').value).toBe('intro');
    });
  });

  describe('invalid', () => {
    it.each([
      ['empty', ''],
      ['only spaces', '   '],
      ['too long (101)', 'a'.repeat(101)],
    ])('rejects %s', (_, input) => {
      expect(() => PostShortDescription.create(input)).toThrow(DomainException);
    });

    it('does not throw TypeError on non-string input', () => {
      expect(() => PostShortDescription.create(undefined)).toThrow(
        DomainException,
      );
      expect(() => PostShortDescription.create(123)).toThrow(DomainException);
    });
  });

  it('equals by value after trim', () => {
    expect(
      PostShortDescription.create('intro').equals(
        PostShortDescription.create(' intro '),
      ),
    ).toBe(true);
  });
});
