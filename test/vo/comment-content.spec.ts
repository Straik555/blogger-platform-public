import { DomainException } from '../../src/core/exception/domain/domain.exception';
import { CommentContent } from '../../src/modules/content/comments/domain/value-objects/comment-content';

describe('CommentContent', () => {
  describe('valid', () => {
    it.each([
      ['min length (20)', 'a'.repeat(20)],
      ['max length (300)', 'a'.repeat(300)],
      ['normal sentence', 'This is a thoughtful comment.'],
    ])('accepts %s', (_, input) => {
      expect(CommentContent.create(input).value).toBe(input);
    });

    it('stores trimmed value', () => {
      const text = 'a'.repeat(20);
      expect(CommentContent.create(`  ${text}  `).value).toBe(text);
    });
  });

  describe('invalid', () => {
    it.each([
      ['empty', ''],
      ['too short (19)', 'a'.repeat(19)],
      ['too long (301)', 'a'.repeat(301)],
      ['19 chars padded with spaces', `     ${'a'.repeat(19)}     `],
    ])('rejects %s', (_, input) => {
      expect(() => CommentContent.create(input)).toThrow(DomainException);
    });

    it('does not throw TypeError on non-string input', () => {
      expect(() => CommentContent.create(undefined)).toThrow(DomainException);
      expect(() => CommentContent.create(123)).toThrow(DomainException);
    });
  });

  it('equals by value after trim', () => {
    const text = 'a'.repeat(25);
    expect(
      CommentContent.create(text).equals(CommentContent.create(` ${text} `)),
    ).toBe(true);
  });
});
