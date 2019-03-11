import React, { FC, useRef } from 'react';
import {
  useTable,
  useColumns,
  useRows,
  useFilters,
  useSortBy,
  usePagination,
  useFlexLayout,
  useExpanded,
  HeaderColumn,
} from 'react-table';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.css';
import { Icon } from '~/components/Icon';
import { CheckboxPrimitive as Checkbox } from '~/components/inputs/Checkbox';
import { SvgCaretDown } from '~/images/icons/CaretDown';
import { useCsvParser } from './useCsvParser';
import { useSelectRow } from './useSelectRow';
import { Context } from './Context';
import { Pagination } from './Pagination';
import { BatchActionsToolbar } from './BatchActionsToolbar';
import { Toolbar } from './Toolbar';
import { Rows } from './Rows';
import { RowActions } from './RowActions';
import { Row as RowType } from './index';
import * as sc from './styles';

interface Props {
  columns: HeaderColumn[];
  data: any[];
  selectable?: boolean;
  csvParserData?: any[];
}

export const TableComponent: FC<Props> = ({
  columns,
  data,
  selectable,
  csvParserData,
  children,
  ...otherProps
}) => {
  const tableToolbarEl = useRef(null);
  const tableBodyEl = useRef(null);
  const isEmpty =
    data.length === 1 && !Object.values(data[0]).find(value => !!value);
  const selectRowColumn: HeaderColumn = {
    accessor: 'selectRow',
    Header: ({ getSelectRowToggleProps }) =>
      isEmpty ? (
        ''
      ) : (
        <Checkbox
          {...getSelectRowToggleProps()}
          aria-label="Select all rows"
          data-testid="select-all-rows"
        />
      ),
    Cell: ({ row }: { row: RowType }) => (
      <Checkbox
        onChange={row.toggleSelected ? row.toggleSelected : () => {}}
        checked={row.isSelected}
        aria-label="Select row"
        data-testid="select-row"
      />
    ),
    width: 60,
  };
  // Define plugins we want to support
  const plugins: any[] = [
    useColumns,
    useRows,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useFlexLayout,
  ];

  // If Table is selectable, add SelectRow plugin
  if (selectable) {
    plugins.push(useSelectRow);
  }

  // If Table has Csv parser data, add CsvParser plugin
  if (csvParserData) {
    plugins.push(useCsvParser(csvParserData));
  }

  const instance = useTable(
    {
      columns: selectable ? [selectRowColumn, ...columns] : columns,
      data,
    },
    ...plugins
  );
  const { getTableProps, headerGroups } = instance;

  return (
    <sc.Table {...getTableProps()} selectable={selectable} {...otherProps}>
      <sc.Toolbar ref={tableToolbarEl} />
      <sc.Inner>
        <SimpleBar>
          <sc.Body ref={tableBodyEl}>
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
                        <Icon
                          Asset={SvgCaretDown}
                          width="0.7em"
                          height="0.7em"
                        />
                      </sc.ButtonSort>
                    )}
                  </sc.HeaderCell>
                ))}
              </sc.HeaderRow>
            ))}
          </sc.Body>
        </SimpleBar>
      </sc.Inner>
      <Context.Provider
        value={{
          ...instance,
          tableToolbarEl: tableToolbarEl.current,
          tableBodyEl: tableBodyEl.current,
        }}
      >
        {children}
      </Context.Provider>
    </sc.Table>
  );
};

export const Table = Object.assign(TableComponent, {
  Pagination,
  BatchActionsToolbar,
  Rows,
  RowActions,
  Toolbar,
});
