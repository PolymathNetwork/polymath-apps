import React, { FC } from 'react';
import { Row as RowType } from 'react-table';
import * as sc from './styles';

export interface Props {
  row: RowType;
  small?: boolean;
}

export const Row: FC<Props> = ({ row, small }) => {
  return (
    <sc.Row {...row.getRowProps()} selected={row.isSelected}>
      {row.cells.map((cell, i: number) => (
        <sc.Cell
          key={i}
          {...cell.getCellProps()}
          style={{ ...cell.getCellProps().style, display: 'flex' }}
          small={small}
        >
          {cell.render('Cell')}
        </sc.Cell>
      ))}
    </sc.Row>
  );
};
