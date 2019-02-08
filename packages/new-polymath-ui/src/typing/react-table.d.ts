// Type definitions for react-table 7
// Project: https://github.com/jxnblk/react-table#readme
// Definitions by: Grsmto <https://github.com/grsmto>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0
declare module 'react-table' {
  export type Cell = {
    render: (type: string) => any;
    getCellProps: () => any;
  };

  export type Row = {
    index: number;
    cells: Cell[];
    getRowProps: () => any;
  };

  export type Column = {
    render: (type: string) => any;
    accessor: string;
    Header?: React.ComponentType;
    Cell?: React.ComponentType;
    minWidth?: number;
    maxWidth?: number;
    Filter?: (props: Api) => JSX.Element;
    id?: undefined;
    width?: undefined;
    getHeaderProps: () => any;
  };

  export type HeaderGroup = {
    headers: Column[];
    getRowProps: () => any;
  };

  export type Hooks = {
    beforeRender: [];
    columns: [];
    headerGroups: [];
    headers: [];
    rows: [];
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
    getTableProps: () => any;
    getRowProps: () => any;
    prepareRow: (row: Row) => any;
  }

  export interface TableProps {
    data: [];
    columns: Column[];
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
    page: Row[];
    pageOptions: [];
  }

  export interface UseRowsValues {
    rows: Row[];
  }

  export interface UseColumnsValues {
    columns: Column[];
    headerGroups: HeaderGroup[];
    headers: Column[];
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
