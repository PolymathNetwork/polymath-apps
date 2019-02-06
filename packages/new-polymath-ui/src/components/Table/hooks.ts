import { useMemo, useState } from 'react';
import { mergeProps, applyPropHooks } from 'react-table/es/utils';

export const useSelectRow = props => {
  const { columns, rows, hooks } = props;
  const [selected, setSelected] = useState([]);

  const toggleSelectAll = () => {
    return setSelected(state => {
      if (state.length) {
        return [];
      }

      return rows.map(row => row.index);
    });
  };

  const toggleSelected = index => {
    return setSelected(state => {
      const isSelected = selected.includes(index);

      if (isSelected) {
        return selected.filter(selectedIndex => selectedIndex !== index);
      }

      return [...state, index];
    });
  };

  hooks.rows.push((rows, api) => {
    rows.getSelectToggleProps = props => {
      return mergeProps(
        {
          onChange: toggleSelectAll,
          checked: selected.length === rows.length,
        },
        applyPropHooks(api.hooks.getSortByToggleProps, rows, api),
        props
      );
    };

    rows.forEach(row => {
      row.toggleSelected = () => toggleSelected(row.index);
    });
    return rows;
  });

  const selectedRows = useMemo(
    () => {
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
