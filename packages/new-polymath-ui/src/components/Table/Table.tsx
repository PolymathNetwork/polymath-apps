import React from 'react';
import {
  useTable,
  useColumns,
  useRows,
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
  usePagination,
  useFlexLayout,
  useSelectRow,
} from './ReactTable';

import * as sc from './Styles';

export const Table = ({ loading, columns, ...props }) => {
  const instance = useTable(
    {
      columns: [
        {
          accessor: 'select',
        },
        ...columns,
      ],
      ...props,
    },
    useColumns,
    useRows,
    useGroupBy,
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

  const renderRow = (row, index, style = {}) => {
    if (!row) {
      return null;
    }
    prepareRow(row);
    return (
      <sc.Row {...row.getRowProps({ style, selected: row.isSelected })}>
        {row.cells.map((cell, i) => {
          return i === 0 ? (
            <sc.Cell key={i} {...cell.getCellProps()}>
              <input
                type="checkbox"
                onChange={row.toggleSelected}
                checked={row.isSelected}
              />
            </sc.Cell>
          ) : (
            <sc.Cell key={i} {...cell.getCellProps()}>
              {cell.render('Cell')}
            </sc.Cell>
          );
        })}
      </sc.Row>
    );
  };

  const tableBody =
    page && page.length ? page.map((row, i) => renderRow(row, i)) : null;

  const pagination = pageOptions.length ? (
    <sc.Pagination {...getRowProps()}>
      <sc.Cell>
        <sc.Button onClick={() => previousPage()} disabled={!canPreviousPage}>
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
  ) : null;

  return (
    <div>
      <sc.Table {...getTableProps()}>
        {headerGroups.map(headerGroup => (
          <sc.HeaderRow {...headerGroup.getRowProps()}>
            {headerGroup.headers.map((column, i) =>
              i === 0 ? (
                <sc.Header {...column.getHeaderProps()}>
                  <div>{column.render('Header')}</div>
                </sc.Header>
              ) : (
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
                  {column.canFilter ? (
                    <div>{column.render('Filter')}</div>
                  ) : null}
                </sc.Header>
              )
            )}
          </sc.HeaderRow>
        ))}
        {tableBody}
        <sc.Row {...getRowProps()}>
          {loading ? (
            <sc.Cell>
              <strong>Loading...</strong>
            </sc.Cell>
          ) : (
            <sc.Cell>{rows.length} Total Records</sc.Cell>
          )}
        </sc.Row>
        {pagination}
      </sc.Table>
    </div>
  );
};
