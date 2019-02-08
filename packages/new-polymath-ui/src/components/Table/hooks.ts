import { useMemo, useState } from 'react';
import { mergeProps, applyPropHooks } from 'react-table/es/utils';
import { Api, Row } from 'react-table';

export interface SelectRowProps extends Api {
  selectable: boolean;
}

export const useSelectRow = (props: SelectRowProps) => {
  const { columns, rows, hooks } = props;
  const [selected, setSelected] = useState([]);

  const toggleSelectAll = () => {
    return setSelected(state => {
      if (state.length === rows.length) {
        return [];
      }

      return rows.map(row => row.index);
    });
  };

  const toggleSelected = (index: number) => {
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
      const newSelectedRows: Row[] = [];

      rows.forEach(row => {
        row.isSelected = selected.includes(row.index);
        newSelectedRows.push(row);
      });

      return newSelectedRows;
    },
    [rows, selected, columns]
  );

  return {
    ...props,
    toggleSelected,
    rows: selectedRows,
  };
};
