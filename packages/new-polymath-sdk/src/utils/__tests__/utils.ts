import { serialize, unserialize } from '../index';

describe('serialize and unserialize', () => {
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

  test('serialize returns the same unique id for the same pojo', () => {
    expect(serialize(entityType, pojo1)).toBe(serialize(entityType, pojo1));
    expect(serialize(entityType, pojo1)).toBe(
      serialize(entityType, inversePojo1)
    );
  });

  test('serialize returns a different unique id for different pojos', () => {
    expect(serialize(entityType, pojo1)).not.toBe(serialize(entityType, pojo2));
  });

  test('unserialize recovers the serialized object', () => {
    expect(unserialize(serialize(entityType, pojo1))).toEqual(pojo1);
    expect(unserialize(serialize(entityType, inversePojo1))).toEqual(pojo1);
  });
});
