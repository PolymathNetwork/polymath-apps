import { serialize } from '../index';

describe('serialize', () => {
  const entityType = 'someEntity';

  const pojo1 = {
    foo: 'Foo',
    bar: 'Bar',
  };

  const inversePojo1 = {
    bar: 'Bar',
    foo: 'Foo',
  };

  const pojo2 = {
    baz: 'baz',
  };

  test('prefixes the unique id with the provided entity type', () => {
    expect(serialize(entityType, pojo1)).toMatch(new RegExp(`^${entityType}:`));
  });

  test('returns the same unique id for the same pojo', () => {
    expect(serialize('', pojo1)).toBe(serialize('', pojo1));
    expect(serialize('', pojo1)).toBe(serialize('', inversePojo1));
  });

  test('returns a different unique id for different pojos', () => {
    expect(serialize('', pojo1)).not.toBe(serialize('', pojo2));
  });
});
