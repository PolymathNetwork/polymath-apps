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
  Column,
} from 'react-table';
import { Icon } from '~/components/Icon';
import { CheckboxPrimitive as Checkbox } from '~/components/inputs/Checkbox';
import { SvgCaretDown } from '~/images/icons/CaretDown';
import { useSelectRow } from './hooks';
import { Context } from './Context';
import { Pagination } from './Pagination';
import { BatchActionsToolbar } from './BatchActionsToolbar';
import { Rows } from './Rows';
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
  const selectRowColumn: Column = {
    accessor: 'selectRow',
    Header: ({ getSelectRowToggleProps }) => (
      <Checkbox {...getSelectRowToggleProps()} />
    ),
    Cell: ({ row }) => (
      <Checkbox onChange={row.toggleSelected} checked={row.isSelected} />
    ),
    width: 60,
  };
  const instance = useTable(
    {
      columns: selectable ? [selectRowColumn, ...columns] : columns,
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
  const { getTableProps, headerGroups } = instance;

  return (
    <sc.Table {...getTableProps()} selectable={selectable}>
      <sc.Body>
        {headerGroups.map(headerGroup => (
          <sc.HeaderRow {...headerGroup.getRowProps()}>
            {headerGroup.headers.map((column, i) => (
              <sc.HeaderCell {...column.getHeaderProps()}>
                {selectable && i === 0 ? (
                  column.render('Header')
                ) : (
                  <sc.ButtonSort
                    variant="raw"
                    iconPosition="right"
                    {...column.getSortByToggleProps()}
                    sorted={column.sorted}
                    sortedDesc={column.sortedDesc}
                  >
                    <span>{column.render('Header')}</span>
                    <Icon Asset={SvgCaretDown} width="0.7em" height="0.7em" />
                  </sc.ButtonSort>
                )}
              </sc.HeaderCell>
            ))}
          </sc.HeaderRow>
        ))}
      </sc.Body>
      <Context.Provider value={instance}>{children}</Context.Provider>
    </sc.Table>
  );
};

export const Table = Object.assign(TableComponent, {
  Pagination,
  BatchActionsToolbar,
  Rows,
});
