import _ from 'lodash';
import Papa, { ParseResult } from 'papaparse';
import * as validators from './validators';

export interface ErrorMessages {
  missingRequiredColumns: string;
  extraColumns: string;
  rowsExceedMaxLimit: string;
}

export interface Props {
  data: any;
  columns: Array<any>;
  header?: boolean;
  maxRows?: number;
  validateRow?: (rowData: Array<any>) => boolean;
  strict?: boolean;
  errorMessages?: ErrorMessages;
}

export interface ResultProps {
  result: Array<any>;
  totalRows: number;
  validRows: number;
  errorRows: number;
  ignoredRows: number;
  validFile: boolean;
  errors: Array<string>;
}

export interface Column {
  name: string;
  validators: Array<validators.ValidatorFn>;
  required?: boolean;
}

/**
 * Parses a CSV file or string and returns array of parsed objects
 * @example
 * parseCsv(
 *  {
 *    data: `Column 1,Column 2,Column 3
 *      1,White,1/1/2019`,
 *    columns: [
 *        {
 *          index: 0,
 *          name: 'Column 1',
 *          validationRules: ['isInt', 'isNotEmpty']
 *        },
 *        {
 *          index: 1,
 *          name: 'Column 2',
 *          validationRules: ['isString', 'isNotEmpty']
 *        },
 *      ],
 *    header: true,
 *    maxRows: 2,
 *    strict: true,
 *    errorMessages: {
 *      missingRequiredColumns: 'Some required columns do not exist in the CSV',
 *      extraColumns: 'the CSV file contains extra columns'
 *      rowsExceedMaxLimit: 'The CSV file contains more columns than the maximum limit'
 *    }
 *  }
 * );
 *
 * @param props Object of type Props containing the conversion details
 */
export const parseCsv = async (props: Props): Promise<ResultProps> => {
  return new Promise(resolve => {
    interface ResultObject {
      [key: string]: any;
      isRowValid: boolean;
    }

    // Prepare the data and errors arrays
    const result: ResultObject[] = [];
    const errors: string[] = [];
    let totalRows: number = 0;
    let validRows: number = 0;
    let errorRows: number = 0;
    let ignoredRows: number = 0;
    let headerRead: boolean = false;
    let validFile: boolean = true;
    let hasExtraRows: boolean = false;
    let hasExtraColumns: boolean = false;

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
            } else {
              // The file has a column that is not defined by the columns definition
              if (props.strict) {
                validFile = false;

                if (
                  props.errorMessages &&
                  props.errorMessages.extraColumns &&
                  !hasExtraColumns
                ) {
                  hasExtraColumns = true;
                  errors.push(props.errorMessages.extraColumns);
                }
              }
            }
          }
          headerRead = true;

          if (
            _.find(props.columns, col => {
              return col.index === undefined && col.required;
            })
          ) {
            validFile = false;

            if (
              props.errorMessages &&
              props.errorMessages.missingRequiredColumns
            ) {
              errors.push(props.errorMessages.missingRequiredColumns);
            }
          }

          return;
        }
        totalRows++;

        if (!props.header && props.columns.length !== results.data[0].length) {
          validFile = false;
        }

        if (
          props.maxRows !== undefined &&
          props.maxRows > 0 &&
          totalRows > props.maxRows
        ) {
          ignoredRows++;

          if (
            props.errorMessages &&
            props.errorMessages.rowsExceedMaxLimit &&
            !hasExtraRows
          ) {
            hasExtraRows = true;
            errors.push(props.errorMessages.rowsExceedMaxLimit);
          }

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
            /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/.test(
              columnValue
            ) &&
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
      resolve({
        result,
        totalRows,
        validRows,
        errorRows,
        ignoredRows,
        validFile,
        errors,
      });
    };
    const config = {
      dynamicTyping: true,
      skipEmptyLines: true,
      header: false,
      step,
      complete,
    };

    Papa.parse(props.data, config);
  });
};
