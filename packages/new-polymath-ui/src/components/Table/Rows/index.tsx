import React, { FC, useContext } from 'react';
import ReactDOM from 'react-dom';
import { Page as PageType, Row as RowType } from 'react-table';
import { Context } from '../Context';
import { Row } from './Row';

export interface Props {
  page: PageType;
  prepareRow: (row: RowType) => any;
  small?: boolean;
}

export const Rows: FC<Props> = props => {
  const { page, prepareRow, tableEl, small } = {
    ...useContext(Context),
    ...props,
  };

  return tableEl && page && page.length
    ? ReactDOM.createPortal(
        page.map(row => {
          if (!row) {
            return null;
          }

          prepareRow(row);

          return <Row key={row.index} row={row} small={small} />;
        }),
        tableEl
      )
    : null;
};
