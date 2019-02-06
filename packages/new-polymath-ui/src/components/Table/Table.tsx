import React, { FC } from 'react';
import {
  useTable,
  useColumns,
  useRows,
  useFilters,
  useSortBy,
  usePagination,
  useFlexLayout,
  useExpanded,
} from 'react-table';

import { useSelectRow } from './hooks';
import * as sc from './Styles';

interface Props {
  columns: Array<{}>;
  selectable: boolean;
}

export const Table: FC<Props> = props => {
  const { selectable } = props;
  const instance = useTable(
    props,
    useColumns,
    useRows,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useFlexLayout,
    useSelectRow
  );

  const {
    getTableProps,
    headerGroups,
    rows,
    getRowProps,
    pageOptions,
    page,
    state: [{ pageIndex, pageSize }],
    gotoPage,
    prepareRow,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  } = instance;

  console.log(instance);

  const renderRow = row => {
    if (!row) {
      return null;
    }

    prepareRow(row);

    return (
      <sc.Row {...row.getRowProps()} selected={row.isSelected}>
        {selectable && (
          <sc.Cell>
            <input
              type="checkbox"
              onChange={row.toggleSelected}
              checked={row.isSelected}
            />
          </sc.Cell>
        )}
        {row.cells.map((cell, i: number) => (
          <sc.Cell key={i} {...cell.getCellProps()}>
            {cell.render('Cell')}
          </sc.Cell>
        ))}
      </sc.Row>
    );
  };

  const tableBody =
    page && page.length ? page.map((row: any) => renderRow(row)) : null;

  return (
    <sc.Table {...getTableProps()}>
      {headerGroups.map(headerGroup => (
        <sc.HeaderRow {...headerGroup.getRowProps()}>
          {selectable && (
            <sc.Header>
              <input type="checkbox" {...rows.getSelectToggleProps()} />
            </sc.Header>
          )}
          {headerGroup.headers.map((column, i: number) => (
            <sc.Header
              {...column.getHeaderProps()}
              sorted={column.sorted}
              sortedDesc={column.sortedDesc}
              sortedIndex={column.sortedIndex}
            >
              <div>
                <span {...column.getSortByToggleProps()}>
                  {column.render('Header')}
                </span>{' '}
                {column.canGroupBy ? (
                  <sc.Emoji {...column.getGroupByToggleProps()}>
                    {column.grouped ? '🛑' : '👊'}
                  </sc.Emoji>
                ) : null}
              </div>
              {column.canFilter ? <div>{column.render('Filter')}</div> : null}
            </sc.Header>
          ))}
        </sc.HeaderRow>
      ))}
      {tableBody}
      {pageOptions.length ? (
        <sc.Pagination {...getRowProps()}>
          <sc.Cell>
            <sc.Button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              Previous
            </sc.Button>{' '}
            <sc.Button onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </sc.Button>{' '}
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <span>
              | Go to page:{' '}
              <sc.Input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                style={{ width: '100px' }}
              />
            </span>{' '}
            <sc.Select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </sc.Select>
          </sc.Cell>
        </sc.Pagination>
      ) : null}
    </sc.Table>
  );
};
