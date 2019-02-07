import { hashObj, delay, parseCsv } from '../index';
import { validRange } from 'semver';

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

describe('csvParser', () => {
  test('should parse file with header correctly', () => {
    const mockCsv = `column 1,column 2
1,value 1
f,faulty value
2, value 2`;
    const columns = [
      {
        index: 0,
        name: 'column 1',
        validationRules: ['isInt', 'isNotEmpty'],
      },
      {
        index: 1,
        name: 'column 2',
        validationRules: ['isString', `isNotEmpty`],
      },
    ];
    const mockValidator = jest.fn(row => true);

    const mockResult = jest.fn(
      (
        result: Array<any>,
        totalRows: number,
        validRows: number,
        errorRows: number,
        ignoredRows: number
      ) => {
        expect(totalRows).toBe(3);
        expect(validRows).toBe(1);
        expect(errorRows).toBe(1);
        expect(ignoredRows).toBe(1);
        expect(result.length).toBe(2);
      }
    );

    parseCsv(mockCsv, columns, true, 2, mockValidator, mockResult);
    expect(mockValidator.mock.calls.length).toBe(1);
    expect(mockResult.mock.calls.length).toBe(1);
  });
});
