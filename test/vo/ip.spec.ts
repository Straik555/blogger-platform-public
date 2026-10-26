import { Ip } from '../../src/modules/sessions/domain/object-value';

describe('Ip', () => {
  describe('valid', () => {
    it.each(['127.0.0.1', '192.168.1.10', '::1', '2001:db8::1'])(
      'keeps %s as is',
      (input) => {
        expect(Ip.create(input).value).toBe(input);
      },
    );

    it('trims spaces', () => {
      expect(Ip.create('  127.0.0.1  ').value).toBe('127.0.0.1');
    });

    it('unwraps IPv4-mapped IPv6', () => {
      expect(Ip.create('::ffff:127.0.0.1').value).toBe('127.0.0.1');
    });
  });

  describe('fallback to default (no throw)', () => {
    it.each([
      ['undefined', undefined],
      ['empty', ''],
      ['only spaces', '   '],
      ['number', 123],
      ['not an ip', 'abc'],
      ['text', 'Hello, world!'],
    ])('%s → default', (_, input) => {
      expect(Ip.create(input).value).toBe(Ip.DEFAULT);
    });
  });

  describe('equals', () => {
    it('same address in different forms → equal', () => {
      expect(Ip.create('::ffff:10.0.0.1').equals(Ip.create('10.0.0.1'))).toBe(
        true,
      );
    });
  });
});
