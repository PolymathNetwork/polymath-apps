import React, { FC } from 'react';
import * as sc from './styles';
import { Row as RowType, Cell as CellType } from '../../index';

export interface Props {
  row: RowType;
  small?: boolean;
}

function renderCell(cell: CellType) {
  if (cell.column.id === 'selectRow') {
    return cell.render('Cell');
  } else {
    if (typeof cell.value === 'undefined') {
      return null;
    } else {
      // if explicitly `null`, it's an empty state, display "-"
      if (cell.value === null) {
        return '-';
      }
    }
  }

  return cell.render('Cell');
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
          {renderCell(cell)}
        </sc.Cell>
      ))}
    </sc.Row>
  );
};
