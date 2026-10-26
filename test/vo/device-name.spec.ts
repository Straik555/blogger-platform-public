import { DeviceName } from '../../src/modules/sessions/domain/object-value';

describe('DeviceName', () => {
  describe('valid', () => {
    it.each([
      ['undefined', undefined],
      ['only spaces', '   '],
      ['number', 123],
    ])('falls back to default for %s', (_, input) => {
      expect(DeviceName.create(input).value).toBe(DeviceName.DEFAULT);
    });

    it('truncates long value to MAX_LENGTH without throwing', () => {
      const result = DeviceName.create('a'.repeat(300));
      expect(result.value).toHaveLength(DeviceName.MAX_LENGTH);
    });

    it('check defaul name', () => {
      expect(DeviceName.create('').value).toBe(DeviceName.DEFAULT);
    });

    it('trims spaces and keeps case', () => {
      expect(DeviceName.create('  User123 ').value).toBe('User123');
    });
  });

  describe('equals', () => {
    it('same value → equal', () => {
      expect(
        DeviceName.create('user_1').equals(DeviceName.create(' user_1 ')),
      ).toBe(true);
    });
  });
});
