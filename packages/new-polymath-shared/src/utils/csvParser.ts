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
  isFileValid: boolean;
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
 * )
 * .then((parseResult => {
 *   // Results are returned as ResultProps object
 * }));
 *
 * @param props Object of type Props containing the conversion details
 * @param props.data Can be a string containing CSV data of a file input value
 * @param props.columns Definition of the columns with their validation rules
 * @param props.header Specifies wether the CSV data has header or not
 * @param props.maxRows Maximum number of rows to parse from the file, any rows beyond that will be ignored
 * @param props.validateRow custom function to perform custom validation on each row
 * @param props.strict Strict mode: if set to true, file will be marked as invalid if the CSV data contain any extra column(s)
 * @param props.errorMessages Specifies the error messages to be returned by the parse if the data has issues
 */
export const parseCsv = async (props: Props): Promise<ResultProps> => {
  return new Promise(resolve => {
    interface ResultRow {
      data: {
        [key: string]: any;
      };
      isRowValid: boolean;
    }

    // Prepare the data and errors arrays
    const result: ResultRow[] = [];
    const errors: string[] = [];
    let totalRows: number = 0;
    let validRows: number = 0;
    let errorRows: number = 0;
    let ignoredRows: number = 0;
    let headerRead: boolean = false;
    let isFileValid: boolean = true;
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
                isFileValid = false;

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
            isFileValid = false;

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
          isFileValid = false;
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

        const resultRow: ResultRow = {
          isRowValid: true,
          data: {},
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

          resultRow.data[column.name] = {
            value: columnValue,
            isColumnValid: isValid,
          };

          resultRow.isRowValid = resultRow.isRowValid && isValid;
        }

        if (typeof props.validateRow === 'function') {
          resultRow.isRowValid =
            resultRow.isRowValid && props.validateRow(results.data[0]);
        }

        result.push(resultRow);

        if (resultRow.isRowValid) {
          validRows++;
        } else {
          errorRows++;
        }
      }
    };

    const complete = () => {
      resolve({
        result,
        totalRows,
        validRows,
        errorRows,
        ignoredRows,
        isFileValid,
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
