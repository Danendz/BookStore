import { ZodError } from 'zod';

import { parseToUint } from '@/helpers/Utils';

describe('Function parseToUint', () => {
  const valid_number = '123';
  const invalid_number = 'asdf';
  const negative_number = '-10';

  test('With valid number', () => {
    expect(parseToUint(valid_number)).toBe(123);
  });

  test('With invalid number', () => {
    expect(() => parseToUint(invalid_number)).toThrow(ZodError);
  });

  test('With negative number', () => {
    expect(() => parseToUint(negative_number)).toThrow(ZodError);
  })
});
