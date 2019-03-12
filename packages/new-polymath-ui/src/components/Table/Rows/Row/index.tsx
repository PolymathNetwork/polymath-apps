import React, { FC } from 'react';
import * as sc from './styles';
import { Row as RowType, Cell as CellType } from '../../index';

export interface Props {
  row: RowType;
  isTableEmpty: boolean;
  small?: boolean;
}

function renderCell(cell: CellType, isTableEmpty: boolean) {
  if (isTableEmpty && typeof cell.value === 'undefined') {
    return null;
  } else if (cell.value === null) {
    // if explicitly `null`, it's an empty state, display "-"
    return '-';
  }
  return cell.render('Cell');
}

export const Row: FC<Props> = ({ row, isTableEmpty, small }) => {
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
          {renderCell(cell, isTableEmpty)}
        </sc.Cell>
      ))}
    </sc.Row>
  );
};
