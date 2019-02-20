import * as csvParser from '../parseCsv';
import * as validators from '../validators';

describe('csvParser', () => {
  test('should parse file with header correctly', () => {
    const mockCsvHeader = `column 1,column 2
1,value 1
f,faulty value
2, value 2`;
    const mockCsvNoHeader = `1,value 1
f,faulty value
2, value 2`;

    const columns: Array<csvParser.Column> = [
      {
        name: 'column 1',
        validators: [validators.isInt, validators.isNotEmpty],
      },
      {
        name: 'column 2',
        validators: [validators.isString, validators.isNotEmpty],
      },
    ];
    const mockValidator = jest.fn(row => true);
    const mockCallbackHeader = jest.fn(
      ({ result, totalRows, errorRows, ignoredRows, validRows }) => {
        expect(result.length).toBe(3);
        expect(totalRows).toBe(3);
        expect(errorRows).toBe(1);
        expect(ignoredRows).toBe(0);
        expect(validRows).toBe(2);
      }
    );
    const mockCallbackNoHeader = jest.fn(
      ({ result, totalRows, errorRows, ignoredRows, validRows }) => {
        expect(result.length).toBe(2);
        expect(totalRows).toBe(3);
        expect(errorRows).toBe(1);
        expect(ignoredRows).toBe(1);
        expect(validRows).toBe(1);
      }
    );

    csvParser.parseCsv({
      data: mockCsvHeader,
      columns,
      header: true,
      validateRow: mockValidator,
      callback: mockCallbackHeader,
    });
    expect(mockValidator.mock.calls.length).toBe(2);
    expect(mockCallbackHeader.mock.calls.length).toBe(1);

    csvParser.parseCsv({
      data: mockCsvNoHeader,
      columns,
      validateRow: mockValidator,
      maxRows: 2,
      callback: mockCallbackNoHeader,
    });
    expect(mockValidator.mock.calls.length).toBe(3);
    expect(mockCallbackNoHeader.mock.calls.length).toBe(1);
  });
});
