import { useMemo } from 'react';

import { getBy, getFirstDefined, setBy } from '../utils';
import { addActions, actions } from '../actions';
import { defaultState } from './useTableState';

defaultState.selected = [];

addActions({
  toggleSelected: '__toggleSelected__',
  useSelectRow: '__useSelectRow__',
});

export const useSelectRow = props => {
  const {
    debug,
    columns,
    rows,
    selectedKey = 'selected',
    hooks,
    state: [{ selected }, setState],
  } = props;

  const toggleSelected = (index, toggle) => {
    return setState(currentState => {
      const { selected } = currentState;
      const isSelected = selected.includes(index);

      if (isSelected) {
        return {
          ...currentState,
          selected: selected.filter(selectedIndex => selectedIndex !== index),
        };
      }
      return {
        ...currentState,
        selected: [...selected, index],
      };
    }, actions.toggleSelected);
  };

  hooks.rows.push(rows => {
    rows.forEach(row => {
      row.toggleSelected = () => toggleSelected(row.index);
    });
    return rows;
  });

  const selectedRows = useMemo(
    () => {
      if (debug) console.info('getselectedRows');

      const selectedRows = [];

      rows.forEach(row => {
        row.isSelected = selected.includes(row.index);
        selectedRows.push(row);
      });

      return selectedRows;
    },
    [rows, selected, columns]
  );

  return {
    ...props,
    toggleSelected,
    rows: selectedRows,
  };
};
