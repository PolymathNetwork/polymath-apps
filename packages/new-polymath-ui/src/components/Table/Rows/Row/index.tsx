import React, { FC } from 'react';
import * as sc from './styles';
import { Row as RowType, Cell as CellType } from '../../index';

export interface Props {
  row: RowType;
  small?: boolean;
}

export const Row: FC<Props> = ({ row, small }) => {
  return (
    <sc.Row
      {...row.getRowProps()}
      selected={row.isSelected}
      hasError={row.isValid === false}
    >
      {row.cells.map((cell: CellType, i: number) => (
        <sc.Cell
          key={i}
          {...cell.getCellProps()}
          style={{ ...cell.getCellProps().style, display: 'flex' }}
          small={small}
          hasError={cell.isValid === false}
        >
          {typeof cell.value === 'undefined' // if explicitly `null`, display "-"
            ? null
            : cell.value === null
            ? '-'
            : cell.render('Cell')}
        </sc.Cell>
      ))}
    </sc.Row>
  );
};
