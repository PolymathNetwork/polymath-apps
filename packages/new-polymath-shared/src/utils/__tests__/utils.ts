import { hashObj } from '../index';

describe('hashObj', () => {
  const pojo = {
    bar: false,
    baz: 1,
    foo: 'Foo',
  };

  const unorderedPojo = {
    baz: 1,
    foo: 'Foo',
    bar: false,
  };
  test('should return a string representation of the supplied POJO', () => {
    expect(hashObj(pojo)).toBe('bar:false,baz:1,foo:Foo');
  });

  test('should be agnostic to the order of the properties', () => {
    expect(hashObj(pojo)).toEqual(hashObj(unorderedPojo));
  });
});

describe('delay', () => {});
