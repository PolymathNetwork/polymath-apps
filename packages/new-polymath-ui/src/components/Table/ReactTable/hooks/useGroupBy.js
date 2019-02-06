import { useMemo } from 'react';

import * as aggregations from '../aggregations';
import { addActions, actions } from '../actions';
import { defaultState } from './useTableState';
import {
  mergeProps,
  applyPropHooks,
  defaultGroupByFn,
  getFirstDefined,
} from '../utils';

defaultState.groupBy = [];

addActions({
  toggleGroupBy: '__toggleGroupBy__',
});

export const useGroupBy = (api, props = {}) => {
  const {
    debug,
    rows,
    columns,
    groupByFn = defaultGroupByFn,
    manualGroupBy,
    disableGrouping,
    aggregations: userAggregations = {},
    hooks,
    state: [{ groupBy }, setState],
  } = api;

  columns.forEach(column => {
    const { id, accessor, canGroupBy } = column;
    column.grouped = groupBy.includes(id);

    column.canGroupBy = accessor
      ? getFirstDefined(
          canGroupBy,
          disableGrouping === true ? false : undefined,
          true
        )
      : false;

    column.Aggregated = column.Aggregated || column.Cell;
  });

  const toggleGroupBy = (id, toggle) => {
    return setState(old => {
      const resolvedToggle =
        typeof set !== 'undefined' ? toggle : !groupBy.includes(id);
      if (resolvedToggle) {
        return {
          ...old,
          groupBy: [...groupBy, id],
        };
      }
      return {
        ...old,
        groupBy: groupBy.filter(d => d !== id),
      };
    }, actions.toggleGroupBy);
  };

  hooks.columns.push(columns => {
    columns.forEach(column => {
      if (column.canGroupBy) {
        column.toggleGroupBy = () => toggleGroupBy(column.id);
      }
    });
    return columns;
  });

  hooks.getGroupByToggleProps = [];

  const addGroupByToggleProps = (columns, api) => {
    columns.forEach(column => {
      const { canGroupBy } = column;
      column.getGroupByToggleProps = props => {
        return mergeProps(
          {
            onClick: canGroupBy
              ? e => {
                  e.persist();
                  column.toggleGroupBy();
                }
              : undefined,
            style: {
              cursor: canGroupBy ? 'pointer' : undefined,
            },
            title: 'Toggle GroupBy',
          },
          applyPropHooks(api.hooks.getGroupByToggleProps, column, api),
          props
        );
      };
    });
    return columns;
  };

  hooks.columns.push(addGroupByToggleProps);
  hooks.headers.push(addGroupByToggleProps);

  const groupedRows = useMemo(
    () => {
      if (manualGroupBy || !groupBy.length) {
        return rows;
      }
      if (debug) console.info('getGroupedRows');
      // Find the columns that can or are aggregating

      // Uses each column to aggregate rows into a single value
      const aggregateRowsToValues = rows => {
        const values = {};
        columns.forEach(column => {
          const columnValues = rows.map(d => d.values[column.id]);
          let aggregate =
            userAggregations[column.aggregate] ||
            aggregations[column.aggregate] ||
            column.aggregate;
          if (typeof aggregate === 'function') {
            values[column.id] = aggregate(columnValues, rows);
          } else if (aggregate) {
            throw new Error(
              `Invalid aggregate "${aggregate}" passed to column with ID: "${
                column.id
              }"`
            );
          } else {
            values[column.id] = columnValues[0];
          }
        });
        return values;
      };

      // Recursively group the data
      const groupRecursively = (rows, groupBy, depth = 0) => {
        // This is the last level, just return the rows
        if (depth >= groupBy.length) {
          return rows;
        }

        // Group the rows together for this level
        let groupedRows = Object.entries(groupByFn(rows, groupBy[depth])).map(
          ([groupByVal, subRows], index) => {
            // Recurse to sub rows before aggregation
            subRows = groupRecursively(subRows, groupBy, depth + 1);

            const values = aggregateRowsToValues(subRows);

            const row = {
              groupByID: groupBy[depth],
              groupByVal,
              values,
              subRows,
              depth,
              index,
            };
            return row;
          }
        );

        return groupedRows;
      };

      // Assign the new data
      return groupRecursively(rows, groupBy);
    },
    [rows, groupBy, columns, manualGroupBy]
  );

  return {
    ...api,
    rows: groupedRows,
  };
};
