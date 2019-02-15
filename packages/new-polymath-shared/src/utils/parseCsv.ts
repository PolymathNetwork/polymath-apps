import _ from 'lodash';
import Papa, { ParseResult } from 'papaparse';
import * as validators from './validators';

export interface Props {
  data: any;
  columns: Array<any>;
  header?: boolean;
  maxRows?: number;
  validateRow?: (rowData: Array<any>) => boolean;
  callback?: (props: CallbackProps) => void;
}

export interface CallbackProps {
  result: Array<any>;
  totalRows: number;
  validRows: number;
  errorRows: number;
  ignoredRows: number;
}

export interface Column {
  name: string;
  validators: Array<validators.ValidatorFn>;
}

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
 *      name: 'Column 1',
 *      validationRules: ['isInt', 'isNotEmpty']
 *    },
 *    {
 *      index: 1,
 *      name: 'Column 2',
 *      validationRules: ['isString', 'isNotEmpty']
 *    },
 *  ],
 *  true,
 *  2,
 *  (rowData: Array<any>) => true,
 *  (
 *    result: Array<any>,
 *    totalRows: number,
 *    validRows: number,
 *    errorRows: number,
 *    ignoredRows: number
 *  ) => {
 *    // Results will be available here
 *  }
 * );
 *
 * @param data Could be a string containing the csv or the file from file input
 * @param columns Array defining column names and validation rules
 * @param header Specify if the CSV contain a header
 * @param maxRows Specify the maximum number of rows to parse, anything beyond this number will be ignored
 * @validateRow custom validator for rows, function sould return a boolean indicating if the row is valid or not
 * @param callback A callback function to call when the parsing is done
 */
export const parseCsv = (props: Props): void => {
  interface ResultObject {
    [key: string]: any;
    isRowValid: boolean;
  }

  // Prepare the data and errors arrays
  const result: Array<any> = [];
  let totalRows: number = 0;
  let validRows: number = 0;
  let errorRows: number = 0;
  let ignoredRows: number = 0;
  let headerRead: boolean = false;

  if (!props.header) {
    for (const headerIndex of Object.keys(props.columns)) {
      props.columns[parseInt(headerIndex, 10)].index = parseInt(
        headerIndex,
        10
      );
    }
  }

  const step = (results: ParseResult) => {
    if (results.data.length === 1) {
      if (props.header && !headerRead) {
        // Map the indexes of the header with the file
        for (const headerIndex of Object.keys(results.data[0])) {
          const column = _.find(props.columns, col => {
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

      if (
        props.maxRows !== undefined &&
        props.maxRows > 0 &&
        totalRows > props.maxRows
      ) {
        ignoredRows++;
        return;
      }
      const resultObj: ResultObject = {
        isRowValid: true,
      };
      for (const column of props.columns) {
        // No header, results are passed as array
        const isValid = _.every(
          column.validators,
          (validator: validators.ValidatorFn) =>
            validator(results.data[0][column.index])
        );
        // Papa Parser handles all data types except date, hadle date here
        let columnValue: any = results.data[0][column.index];
        if (
          columnValue !== '' &&
          columnValue !== null &&
          typeof columnValue !== undefined &&
          parseInt(columnValue, 10).toString() === 'NaN' &&
          new Date(columnValue).toString() !== 'Invalid Date'
        ) {
          columnValue = new Date(columnValue);
        }
        resultObj[column.name] = {
          value: columnValue,
          isColumnValid: isValid,
        };
        resultObj.isRowValid = resultObj.isRowValid && isValid;
      }
      if (typeof props.validateRow === 'function') {
        resultObj.isRowValid =
          resultObj.isRowValid && props.validateRow(results.data[0]);
      }
      result.push(resultObj);
      if (resultObj.isRowValid) {
        validRows++;
      } else {
        errorRows++;
      }
    }
  };
  const complete = (results: ParseResult) => {
    if (typeof props.callback === 'function') {
      props.callback({
        result,
        totalRows,
        validRows,
        errorRows,
        ignoredRows,
      });
    }
  };
  const config = {
    dynamicTyping: true,
    skipEmptyLines: true,
    header: false,
    step,
    complete,
  };
  Papa.parse(props.data, config);
};
