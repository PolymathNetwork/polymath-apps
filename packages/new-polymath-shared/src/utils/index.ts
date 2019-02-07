import { saveAs } from 'file-saver';
import { parse, json2csv } from 'json2csv';
import { Pojo, isPojo } from '~/typing/types';
import _ from 'lodash';
import Papa, { ParseResult } from 'papaparse';
import { Validator, createValidator } from './validator';
import { object } from 'prop-types';

export const delay = async (amount: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, amount);
  });
};

/**
 * Returns a string hash of a POJO for comparison
 *
 * @param args arguments to hash
 */
export function hashObj(args: Pojo): string {
  const sortedKeyArray = _.keys(args).sort();

  return _.join(
    _.map(sortedKeyArray, key => {
      const val = args[key];
      let result;

      if (isPojo(val)) {
        result = hashObj(val);
      } else {
        result = `${args[key]}`;
      }

      return `${key}:${result}`;
    }),
    ','
  );
}

export const toEtherscanUrl = (
  value: string,
  { network, type = 'tx' }: { network?: string; type?: string } = {}
) => `https://${network ? network + '.' : ''}etherscan.io/${type}/${value}`;

/**
 * Generates a CSV file from JSON data and triggers a download in the client
 *
 * @param data json2csv data, see https://www.npmjs.com/package/json2csv#javascript-module-examples
 * @param fileName name of the downloaded file
 * @param opts json2csv options, see https://www.npmjs.com/package/json2csv#available-options
 */
export const downloadCsvFile = <T>(
  data: Readonly<T> | ReadonlyArray<T>,
  fileName: string,
  opts?: json2csv.Options<T>
) => {
  const csvOutput = parse(data, opts);

  const blob = new Blob([csvOutput], { type: 'text/csv' });

  saveAs(blob, fileName);
};

/**
 * Parses a CSV file or string and returns array of parsed objects
 * @example
 * parseCsv(
 *  `Column 1,Column 2,Column 3
 *   1,White,1/1/2019
 *  `,
 *  [
 *    {
 *      index: 0,
 *      name: "Column 1",
 *      validationRules: ["isInt", "isNotEmpty"]
 *    },
 *    {
 *      index: 1,
 *      name: "Column 2",
 *      validationRules: ["isString", "isNotEmpty"]
 *    },
 *  ]
 * );
 *
 * @param data Could be a string containing the csv or the file from file input
 * @param columns Array defining column names and validation rules
 * @param header Specify if the CSV contain a header
 * @param maxRows Specify the maximum number of rows to parse, anything beyond this number will be ignored
 * @validateRow custom validator for rows, function sould return a boolean indicating if the row is valid or not
 * @param callback A callback function to call when the parsing is done
 */
export const parseCsv = (
  data: any,
  columns: Array<any>,
  header?: boolean,
  maxRows?: number,
  validateRow?: (rowData: Array<any>) => boolean,
  callback?: (
    result: Array<any>,
    totalRows: number,
    validRows: number,
    errorRows: number,
    ignoredRows: number
  ) => void
): void => {
  interface IResultObject {
    [key: string]: any;
    isRowValid: boolean;
  }

  // default parameters
  const hasHeader: boolean = header === undefined ? false : header;
  // Init the validator
  const validator: Validator = createValidator();

  // Prepare the data and errors arrays
  const parseResult: Array<any> = [];
  let totalRows: number = 0;
  let validRows: number = 0;
  let errorRows: number = 0;
  let ignoredRows: number = 0;
  let headerRead: boolean = false;

  const step = (results: ParseResult) => {
    if (results.data.length === 1) {
      if (hasHeader && !headerRead) {
        // Map the indexes of the header with the file
        for (const headerIndex of Object.keys(results.data[0])) {
          const column = _.find(columns, col => {
            return col.name === results.data[0][headerIndex];
          });
          if (column) {
            column.index = parseInt(headerIndex, 10);
          }
        }
        headerRead = true;

        return;
      }

      totalRows++;

      if (maxRows !== undefined && maxRows > 0 && totalRows > maxRows) {
        ignoredRows++;
        return;
      }
      const resultObj: IResultObject = {
        isRowValid: true,
      };
      for (const column of columns) {
        // No header, results are passed as array
        const isValid = validator.validate(
          results.data[0][column.index],
          column.validationRules
        );
        // Papa Parser handles all data types except date, hadle date here
        let columnValue: any = results.data[0][column.index];
        if (
          columnValue !== '' &&
          columnValue !== null &&
          typeof columnValue !== undefined &&
          new Date(columnValue).toString() !== 'Invalid Date'
        ) {
          columnValue = new Date(columnValue);
        } else {
          columnValue = results.data[0][column.index];
        }

        resultObj[column.name] = {
          value: columnValue,
          isColumnValid: isValid,
        };
        resultObj.isRowValid = resultObj.isRowValid && isValid;
      }

      if (typeof validateRow === 'function') {
        resultObj.isRowValid =
          resultObj.isRowValid && validateRow(results.data[0]);
      }
      parseResult.push(resultObj);
      if (resultObj.isRowValid) {
        validRows++;
      } else {
        errorRows++;
      }
    }
  };
  const complete = (results: ParseResult) => {
    if (typeof callback === 'function') {
      callback(parseResult, totalRows, validRows, errorRows, ignoredRows);
    }
  };
  const config = {
    dynamicTyping: true,
    skipEmptyLines: true,
    header: false,
    step,
    complete,
  };
  Papa.parse(data, config);
};
