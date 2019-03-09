import _ from 'lodash';
import Papa, { ParseResult } from 'papaparse';
import * as validators from './validators';

export enum ErrorCodes {
  missingRequiredColumns = 'missingRequiredColumns',
  extraColumns = 'extraColumns',
  rowsExceedMaxLimit = 'rowsExceedMaxLimit',
}

export interface Props {
  data: string | File;
  columns: Array<Column>;
  header?: boolean;
  maxRows?: number;
  validateRow?: (rowData: Array<any>) => boolean;
  strict?: boolean;
}

export interface ResultProps {
  result: ResultRow[];
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

export interface ResultRow {
  data: {
    [key: string]: {
      isColumnValid: boolean;
      value: any;
    };
  };
  isRowValid: boolean;
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
 *          name: 'Column 1',
 *          validationRules: [validators.isInt, validators.isNotEmpty]
 *        },
 *        {
 *          name: 'Column 2',
 *          validationRules: [validators.isString, validators.isNotEmpty]
 *        },
 *        {
 *          name: 'Column 3',
 *          validationRules: [validators.isDate, validators.isNotEmpty]
 *        },
 *      ],
 *    header: true,
 *    maxRows: 2,
 *    strict: true,
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
 */
export const parseCsv = async (props: Props): Promise<ResultProps> => {
  return new Promise(resolve => {
    // Prepare the data and errors arrays
    const result: ResultRow[] = [];
    const errors: string[] = [];
    let indexedColumns: Array<Column & { index: number }>;
    let totalRows: number = 0;
    let validRows: number = 0;
    let errorRows: number = 0;
    let ignoredRows: number = 0;
    let headerRead: boolean = false;
    let isFileValid: boolean = true;
    let hasExtraRows: boolean = false;
    let hasExtraColumns: boolean = false;

    const {
      header,
      data,
      columns,
      maxRows,
      validateRow,
      strict,
    } = props;

    if (!header) {
      indexedColumns = columns.map((column, index) => ({
        ...column,
        index,
      }));
    }

    const step = (results: ParseResult) => {
      const { data: resultsData } = results;
      if (resultsData.length === 1) {
        if (header && !headerRead) {
          indexedColumns = _.map(columns, col => ({
            ...col,
            index: -1,
          }));
          // Map the indexes of the header with the file
          for (const headerIndex of Object.keys(resultsData[0])) {
            const columnIndex = _.findIndex(columns, col => {
              return col.name === resultsData[0][headerIndex];
            });

            if (columnIndex >= 0) {
              const index = parseInt(headerIndex, 10);
              indexedColumns[columnIndex].index = index;
            } else {
              // The file has a column that is not defined by the columns definition
              if (strict) {
                isFileValid = false;

                if (!hasExtraColumns) {
                  hasExtraColumns = true;
                  errors.push(ErrorCodes.extraColumns);
                }
              }
            }
          }
          headerRead = true;
          if (
            _.find(indexedColumns, col => {
              return col.index === -1 && col.required;
            })
          ) {
            isFileValid = false;

            errors.push(ErrorCodes.missingRequiredColumns);
          }

          return;
        }
        totalRows++;

        if (!header && indexedColumns.length !== resultsData[0].length) {
          isFileValid = false;
        }

        if (maxRows !== undefined && maxRows > 0 && totalRows > maxRows) {
          ignoredRows++;

          if (
            !hasExtraRows
          ) {
            hasExtraRows = true;
            errors.push(ErrorCodes.rowsExceedMaxLimit);
          }

          return;
        }

        const resultRow: ResultRow = {
          isRowValid: true,
          data: {},
        };

        for (const column of indexedColumns) {
          const { index, name } = column;
          // No header, results are passed as array
          const isValid = _.every(
            column.validators,
            (validator: validators.ValidatorFn) =>
              validator(resultsData[0][index])
          );
          // Papa Parser handles all data types except date, hadle date here
          let columnValue: any = resultsData[0][index];

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

          resultRow.data[name] = {
            value: columnValue,
            isColumnValid: isValid,
          };

          resultRow.isRowValid = resultRow.isRowValid && isValid;
        }

        if (typeof validateRow === 'function') {
          resultRow.isRowValid =
            resultRow.isRowValid && validateRow(resultsData[0]);
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

    // NOTE @monitz87: this might seem unintuitive but it's necessary for type safety in the props
    if (typeof data === 'string') {
      Papa.parse(data, config);
    } else {
      Papa.parse(data, config);
    }
  });
};
