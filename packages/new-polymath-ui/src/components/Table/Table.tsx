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
  Row,
} from 'react-table';
import { Button } from '~/components/Button';
import { Icon } from '~/components/Icon';
import { Box } from '~/components/Box';
import { Text } from '~/components/Text';
import { SvgDelete } from '~/images/icons/Delete';
import { SvgCaretDown } from '~/images/icons/CaretDown';
import { useSelectRow } from './hooks';
import * as sc from './Styles';

interface Props {
  columns: [];
  data: [];
  selectable: boolean;
}

export const Table: FC<Props> = ({ columns, data, selectable }) => {
  const instance = useTable(
    {
      columns,
      data,
    },
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

  const selectedRows = rows.filter(row => row.isSelected);

  const renderRow = (row: Row) => {
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
          <sc.Cell
            key={i}
            {...cell.getCellProps()}
            style={{ ...cell.getCellProps().style, display: 'flex' }}
          >
            {cell.render('Cell')}
          </sc.Cell>
        ))}
      </sc.Row>
    );
  };

  const tableBody =
    page && page.length ? page.map(row => renderRow(row)) : null;

  return (
    <sc.Table {...getTableProps()} selectable={true}>
      {selectedRows.length ? (
        <sc.BatchActionsToolbar>
          <Button variant="ghost" iconPosition="right" onClick={() => {}}>
            Delete <Icon Asset={SvgDelete} />
          </Button>
          <Button variant="ghost" iconPosition="right" onClick={() => {}}>
            Edit <Icon Asset={SvgDelete} />
          </Button>
          <Box ml="auto">
            {selectedRows.length} items selected
            <Button variant="ghost" iconPosition="right" onClick={() => {}}>
              Cancel
            </Button>
          </Box>
        </sc.BatchActionsToolbar>
      ) : null}
      {headerGroups.map(headerGroup => (
        <sc.HeaderRow {...headerGroup.getRowProps()}>
          {selectable && (
            <sc.HeaderCell>
              <input type="checkbox" {...rows.getSelectToggleProps()} />
            </sc.HeaderCell>
          )}
          {headerGroup.headers.map((column, i: number) => (
            <sc.HeaderCell {...column.getHeaderProps()}>
              <sc.Button
                variant="raw"
                iconPosition="right"
                {...column.getSortByToggleProps()}
                sorted={column.sorted}
                sortedDesc={column.sortedDesc}
                sortedIndex={column.sortedIndex}
              >
                <span>{column.render('Header')}</span>
                <Icon Asset={SvgCaretDown} width="0.7em" height="0.7em" />
              </sc.Button>
            </sc.HeaderCell>
          ))}
        </sc.HeaderRow>
      ))}
      {tableBody}
      {pageOptions.length ? (
        <sc.Pagination {...getRowProps()}>
          Items per page:
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
          <Box ml="auto">
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <Button
              variant="ghost"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              Previous
            </Button>
            <span>
              | Go to page:{' '}
              <sc.Input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={e => {
                  const newPageIndex = e.target.value
                    ? Number(e.target.value) - 1
                    : 0;
                  gotoPage(newPageIndex);
                }}
                style={{ width: '100px' }}
              />
            </span>
            <Button
              variant="ghost"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              Next
            </Button>{' '}
          </Box>
        </sc.Pagination>
      ) : null}
    </sc.Table>
  );
};
