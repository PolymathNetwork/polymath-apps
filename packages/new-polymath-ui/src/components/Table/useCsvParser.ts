import { useMemo } from 'react';
import {
  Api as ReactTableApi,
  Row as ReactTableRow,
  Cell as ReactTableCell,
} from 'react-table';
import { csvParser } from '@polymathnetwork/new-shared';

export interface CsvParserProps extends ReactTableApi {}
export interface Row extends ReactTableRow {
  isValid?: boolean;
}
export interface Cell extends ReactTableCell {
  isValid?: boolean;
}

export const useCsvParser = (csvParserData: csvParser.ResultRow[]) => (
  props: CsvParserProps
) => {
  const { rows } = props;

  // We need to mutate the rows due to how react-table work at the moment
  const mutatedRows = useMemo(
    () => {
      rows.forEach((row: Row) => {
        row.isValid = csvParserData[row.index].isRowValid;
        row.cells.forEach((cell: Cell) => {
          cell.isValid =
            csvParserData[row.index].data[cell.column.id].isColumnValid;
        });
      });

      return rows;
    },
    [rows, csvParserData]
  );

  return {
    ...props,
    rows: mutatedRows,
  };
};
