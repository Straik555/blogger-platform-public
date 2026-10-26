import { DomainException } from '../../src/core/exception/domain/domain.exception';
import { WebsiteUrl } from '../../src/modules/content/blogs/domain/value-objects';

describe('WebsiteUrl', () => {
  // 'https://' (8) + 88 + '.com' (4) = 100
  const maxUrl = `https://${'a'.repeat(88)}.com`;

  describe('valid', () => {
    it.each([
      ['simple domain', 'https://myblog.com'],
      ['subdomain', 'https://blog.example.com'],
      ['path', 'https://myblog.com/posts/first'],
      ['trailing slash', 'https://myblog.com/'],
      ['max length (100)', maxUrl],
    ])('accepts %s', (_, input) => {
      expect(WebsiteUrl.create(input).value).toBe(input);
    });

    it('stores trimmed value', () => {
      expect(WebsiteUrl.create('  https://myblog.com  ').value).toBe(
        'https://myblog.com',
      );
    });
  });

  describe('invalid', () => {
    it.each([
      ['http instead of https', 'http://myblog.com'],
      ['no protocol', 'myblog.com'],
      ['no dot in domain', 'https://myblog'],
      ['space in domain', 'https://my blog.com'],
      ['query string', 'https://myblog.com?x=1'],
      ['too short', 'https://'],
      ['too long (101)', `https://${'a'.repeat(89)}.com`],
    ])('rejects %s', (_, input) => {
      expect(() => WebsiteUrl.create(input)).toThrow(DomainException);
    });

    it('does not throw TypeError on non-string input', () => {
      expect(() => WebsiteUrl.create(undefined)).toThrow(DomainException);
      expect(() => WebsiteUrl.create(123)).toThrow(DomainException);
    });
  });

  it('equals by value after trim', () => {
    expect(
      WebsiteUrl.create('https://myblog.com').equals(
        WebsiteUrl.create(' https://myblog.com '),
      ),
    ).toBe(true);
  });
});
