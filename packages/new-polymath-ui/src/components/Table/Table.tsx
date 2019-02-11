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
import { SvgDelete } from '~/images/icons/Delete';
import { SvgCaretDown } from '~/images/icons/CaretDown';
import { useSelectRow } from './hooks';
import { Context } from './Context';
import { Pagination } from './Pagination';
import * as sc from './styles';

interface Props {
  columns: [];
  data: [];
  selectable: boolean;
}

export const TableComponent: FC<Props> = ({
  columns,
  data,
  selectable,
  children,
}) => {
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

  const { getTableProps, headerGroups, rows, page, prepareRow } = instance;

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
              <sc.ButtonSort
                variant="raw"
                iconPosition="right"
                {...column.getSortByToggleProps()}
                sorted={column.sorted}
                sortedDesc={column.sortedDesc}
                sortedIndex={column.sortedIndex}
              >
                <span>{column.render('Header')}</span>
                <Icon Asset={SvgCaretDown} width="0.7em" height="0.7em" />
              </sc.ButtonSort>
            </sc.HeaderCell>
          ))}
        </sc.HeaderRow>
      ))}
      {tableBody}
      <Context.Provider value={instance}>{children}</Context.Provider>
    </sc.Table>
  );
};

export const Table = Object.assign(TableComponent, {
  Pagination,
});
