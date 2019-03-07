// Type definitions for react-table 7
// Project: https://github.com/jxnblk/react-table#readme
// Definitions by: Grsmto <https://github.com/grsmto>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0
declare module 'react-table' {
  export type Cell = {
    render: (type: string) => any;
    getCellProps: () => any;
    column: Column;
    row: Row;
    state: any;
    value: any;
  };

  export type Row = {
    index: number;
    cells: Cell[];
    getRowProps: () => any;
    originalRow: any;
    values: any[];
  };

  export interface HeaderColumn {
    accessor: string | ((originalRow: any) => string);
    Header?: string | ((props: Api) => JSX.Element | string);
    Filter?: string | ((props: Api) => JSX.Element | string);
    Cell?: string | ((cell: Cell) => JSX.Element | string);
    id?: string | number;
    minWidth?: string | number;
    maxWidth?: string | number;
    width?: string | number;
  }

  export interface Column extends HeaderColumn {
    id: string | number;
  }

  export type Page = Row[];

  export interface EnhancedColumn extends Column {
    render: (type: string) => any;
    getHeaderProps: () => any;
    getSortByToggleProps: () => any;
    sorted: boolean;
    sortedDesc: boolean;
    sortedIndex: number;
  }

  export type HeaderGroup = {
    headers: EnhancedColumn[];
    getRowProps: () => any;
  };

  export type Hooks = {
    beforeRender: [];
    columns: [];
    headerGroups: [];
    headers: [];
    rows: Row[];
    row: [];
    renderableRows: [];
    getTableProps: [];
    getRowProps: [];
    getHeaderRowProps: [];
    getHeaderProps: [];
    getCellProps: [];
  };

  export interface Api
    extends TableProps,
      UseRowsValues,
      UseFiltersValues,
      UsePaginationValues,
      UseColumnsValues {
    hooks: Hooks;
    rows: Row[];
    columns: EnhancedColumn[];
    getTableProps: () => any;
    getRowProps: () => any;
    prepareRow: (row: Row) => any;
    getSelectRowToggleProps: () => any;
    toggleSelectAll: (forcedState: boolean) => any;
  }

  export interface TableProps {
    data: any[];
    columns: HeaderColumn[];
    state?: any;
    debug?: boolean;
  }

  export interface RowsProps {
    subRowsKey: string;
  }

  export interface FiltersProps {
    filterFn: () => void;
    manualFilters: boolean;
    disableFilters: boolean;
    setFilter: () => any;
    setAllFilters: () => any;
  }

  export interface UsePaginationValues {
    nextPage: () => any;
    previousPage: () => any;
    setPageSize: (size: number) => any;
    gotoPage: (page: number) => any;
    canPreviousPage: boolean;
    canNextPage: boolean;
    page: Page;
    pageOptions: [];
  }

  export interface UseRowsValues {
    rows: Row[];
  }

  export interface UseColumnsValues {
    columns: EnhancedColumn[];
    headerGroups: HeaderGroup[];
    headers: EnhancedColumn[];
  }

  export interface UseFiltersValues {
    setFilter: () => any;
    setAllFilters: () => any;
  }

  export function useTable(props: TableProps, ...plugins: any[]): Api;

  export function useColumns(props: TableProps): TableProps & UseColumnsValues;

  export function useRows(props: TableProps): TableProps & UseRowsValues;

  export function useFilters(
    props: TableProps
  ): TableProps & {
    rows: Row[];
  };

  export function useSortBy(
    props: TableProps
  ): TableProps & {
    rows: Row[];
  };

  export function usePagination(props: TableProps): UsePaginationValues;

  export function useFlexLayout(props: TableProps): TableProps;

  export function useExpanded(
    props: TableProps
  ): TableProps & {
    toggleExpandedByPath: () => any;
    expandedDepth: [];
    rows: [];
  };
}
