const { isPositiveIntegerString } = require('../../src/stories/validation');

/**
 * @group unit
 */
describe('isPositiveIntegerString', () => {
  test.each(['1', '20'])('%d is a positive integer', (value) => {
    expect(isPositiveIntegerString(value)).toBe(true);
  });

  test.each([
    '',
    ' ',
    0,
    '0',
    -1,
    '-1',
    '+1',
    1.4,
    '1.4',
    null,
    undefined,
    [],
    new Date(),
    [],
  ])('%d is not a positive integer', (value) => {
    expect(isPositiveIntegerString(value)).toBe(false);
  });
});
