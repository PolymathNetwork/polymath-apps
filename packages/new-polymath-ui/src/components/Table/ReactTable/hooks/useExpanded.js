import { useMemo } from 'react';

import { getBy, getFirstDefined, setBy } from '../utils';
import { addActions, actions } from '../actions';
import { defaultState } from './useTableState';

defaultState.expanded = {};

addActions({
  toggleExpanded: '__toggleExpanded__',
  useExpanded: '__useExpanded__',
});

export const useExpanded = props => {
  const {
    debug,
    columns,
    rows,
    expandedKey = 'expanded',
    hooks,
    state: [{ expanded }, setState],
  } = props;

  const toggleExpandedByPath = (path, set) => {
    return setState(old => {
      const { expanded } = old;
      const existing = getBy(expanded, path);
      set = getFirstDefined(set, !existing);
      return {
        ...old,
        expanded: setBy(expanded, path, set),
      };
    }, actions.toggleExpanded);
  };

  hooks.row.push(row => {
    const { path } = row;
    row.toggleExpanded = set => toggleExpandedByPath(path, set);
  });

  const expandedRows = useMemo(
    () => {
      if (debug) console.info('getExpandedRows');

      const expandedRows = [];

      // Here we do some mutation, but it's the last stage in the
      // immutable process so this is safe
      const handleRow = (row, index, depth = 0, parentPath = []) => {
        // Compute some final state for the row
        const path = [...parentPath, index];

        row.path = path;
        row.depth = depth;

        row.isExpanded =
          (row.original && row.original[expandedKey]) || getBy(expanded, path);

        row.cells = columns.map(column => {
          const cell = {
            column,
            row,
            state: null,
            value: row.values[column.id],
          };

          return cell;
        });

        expandedRows.push(row);

        if (row.isExpanded && row.subRows && row.subRows.length) {
          row.subRows.forEach((row, i) => handleRow(row, i, depth + 1, path));
        }
      };

      rows.forEach((row, i) => handleRow(row, i));

      return expandedRows;
    },
    [rows, expanded, columns]
  );

  const expandedDepth = findExpandedDepth(expanded);

  return {
    ...props,
    toggleExpandedByPath,
    expandedDepth,
    rows: expandedRows,
  };
};

function findExpandedDepth(obj, depth = 1) {
  return Object.values(obj).reduce((prev, curr) => {
    if (typeof curr === 'object') {
      return Math.max(prev, findExpandedDepth(curr, depth + 1));
    }
    return depth;
  }, 0);
}
