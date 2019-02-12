import * as csvParser from '../csvParser';
import * as validators from '../validators';

describe('csvParser', () => {
  test('should parse file with header correctly', async () => {
    const mockCsvHeader = `column 1,column 2
  1,value 1
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
    const result = await csvParser.parseCsv({
      data: mockCsvHeader,
      columns,
      header: true,
      validateRow: mockValidator,
      maxRows: 2,
    });
    expect(result.result.length).toBe(2);
    expect(result.totalRows).toBe(3);
    expect(result.errorRows).toBe(1);
    expect(result.ignoredRows).toBe(1);
    expect(result.validRows).toBe(1);
    expect(mockValidator.mock.calls.length).toBe(1);
  });
  test('should mark file as invalid if missing required field', async () => {
    const mockCsvHeader = `column 1,column 2
  1,value 1
  f,faulty value
  2, value 2`;

    const columns: Array<csvParser.Column> = [
      {
        name: 'column 1',
        validators: [validators.isInt, validators.isNotEmpty],
        required: true,
      },
      {
        name: 'column 2',
        validators: [validators.isString, validators.isNotEmpty],
        required: true,
      },
      {
        name: 'column 3',
        validators: [validators.isString, validators.isNotEmpty],
        required: true,
      },
    ];
    const mockValidator = jest.fn(row => true);
    const result = await csvParser.parseCsv({
      data: mockCsvHeader,
      columns,
      header: true,
      validateRow: mockValidator,
    });
    expect(result.validFile).toBe(false);
  });
  test('should mark file as valid if missing non-required field', async () => {
    const mockCsvHeader = `column 1,column 2
  1,value 1
  f,faulty value
  2, value 2`;

    const columns: Array<csvParser.Column> = [
      {
        name: 'column 1',
        validators: [validators.isInt, validators.isNotEmpty],
        required: true,
      },
      {
        name: 'column 2',
        validators: [validators.isString, validators.isNotEmpty],
        required: true,
      },
      {
        name: 'column 3',
        validators: [validators.isString, validators.isNotEmpty],
      },
    ];
    const mockValidator = jest.fn(row => true);
    const result = await csvParser.parseCsv({
      data: mockCsvHeader,
      columns,
      header: true,
      validateRow: mockValidator,
    });
    expect(result.validFile).toBe(true);
  });
  test('should mark file as invalid if it has extra fields in strict mode', async () => {
    const mockCsvHeader = `column 1,column 2,column 3
  1,value 1,12
  f,faulty value,12
  2, value 2, 13`;

    const columns: Array<csvParser.Column> = [
      {
        name: 'column 1',
        validators: [validators.isInt, validators.isNotEmpty],
        required: true,
      },
      {
        name: 'column 2',
        validators: [validators.isString, validators.isNotEmpty],
        required: true,
      },
    ];
    const mockValidator = jest.fn(row => true);
    const result = await csvParser.parseCsv({
      data: mockCsvHeader,
      columns,
      header: true,
      strict: true,
      validateRow: mockValidator,
    });
    expect(result.validFile).toBe(false);
  });
  test('should mark file as valid if it has extra fields in non strict mode', async () => {
    const mockCsvHeader = `column 1,column 2,column 3
  1,value 1,12
  f,faulty value,12
  2, value 2, 13`;

    const columns: Array<csvParser.Column> = [
      {
        name: 'column 1',
        validators: [validators.isInt, validators.isNotEmpty],
        required: true,
      },
      {
        name: 'column 2',
        validators: [validators.isString, validators.isNotEmpty],
        required: true,
      },
    ];
    const mockValidator = jest.fn(row => true);
    const result = await csvParser.parseCsv({
      data: mockCsvHeader,
      columns,
      header: true,
      validateRow: mockValidator,
    });
    expect(result.validFile).toBe(true);
  });
  test('should parse file without header correctly', async () => {
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
    const result = await csvParser.parseCsv({
      data: mockCsvNoHeader,
      columns,
      validateRow: mockValidator,
      maxRows: 2,
    });
    expect(result.result.length).toBe(2);
    expect(result.totalRows).toBe(3);
    expect(result.errorRows).toBe(1);
    expect(result.ignoredRows).toBe(1);
    expect(result.validRows).toBe(1);
    expect(mockValidator.mock.calls.length).toBe(1);
  });
});
