import { useMemo, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

import { addActions, actions } from '../actions';
import { defaultState } from './useTableState';

defaultState.pageSize = 10;
defaultState.pageIndex = 0;

addActions({
  pageChange: '__pageChange__',
});

const propTypes = {
  defaultPageSize: PropTypes.number,
  defaultPageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  pages: PropTypes.number,
  pageIndex: PropTypes.number,
  onStateChange: PropTypes.func,
  stateReducer: PropTypes.func,
  debug: PropTypes.bool,
};

export const usePagination = props => {
  // Validate props
  PropTypes.checkPropTypes(propTypes, props, 'property', 'usePagination');

  const {
    debug: parentDebug,
    rows,
    manualPagination,
    debug = parentDebug,
    state: [
      {
        pageSize,
        pageIndex,
        pageCount: userPageCount,
        filters,
        groupBy,
        sortBy,
      },
      setState,
    ],
  } = props;

  useLayoutEffect(
    () => {
      setState(
        old => ({
          ...old,
          pageIndex: 0,
        }),
        actions.pageChange
      );
    },
    [filters, groupBy, sortBy]
  );

  const { pages, pageCount } = useMemo(
    () => {
      if (manualPagination) {
        return {
          pages: [rows],
          pageCount: userPageCount,
        };
      }
      if (debug) console.info('getPages');

      // Create a new pages with the first page ready to go.
      const pages = rows.length ? [] : [[]];

      // Start the pageIndex and currentPage cursors
      let cursor = 0;
      while (cursor < rows.length) {
        const end = cursor + pageSize;
        pages.push(rows.slice(cursor, end));
        cursor = end;
      }

      const pageCount = pages.length;

      return {
        pages,
        pageCount,
        pageOptions,
      };
    },
    [rows, pageSize, userPageCount]
  );

  const pageOptions = [...new Array(pageCount)].map((d, i) => i);
  const page = manualPagination ? rows : pages[pageIndex] || [];
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  const gotoPage = pageIndex => {
    if (debug) console.info('gotoPage');
    return setState(old => {
      if (pageIndex < 0 || pageIndex > pageCount - 1) {
        return old;
      }
      return {
        ...old,
        pageIndex,
      };
    }, actions.pageChange);
  };

  const previousPage = () => {
    return gotoPage(pageIndex - 1);
  };

  const nextPage = () => {
    return gotoPage(pageIndex + 1);
  };

  const setPageSize = pageSize => {
    setState(old => {
      const topRowIndex = old.pageSize * old.pageIndex;
      const pageIndex = Math.floor(topRowIndex / pageSize);
      return {
        ...old,
        pageIndex,
        pageSize,
      };
    }, actions.setPageSize);
  };

  return {
    ...props,
    pages,
    pageOptions,
    page,
    canPreviousPage,
    canNextPage,
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
  };
};
