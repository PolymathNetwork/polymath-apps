import { useMemo, useState, useEffect } from 'react';
import { Api as ReactTableApi, Row as ReactTableRow } from 'react-table';

export interface SelectRowProps extends ReactTableApi {}
export interface Row extends ReactTableRow {
  isSelected?: boolean;
  getSelectToggleProps?: () => any;
  toggleSelected?: (index: number) => void;
}

export const useSelectRow = (props: SelectRowProps) => {
  const { columns, rows, data } = props;
  const initialState: number[] = [];
  const [selected, setSelected] = useState(initialState);

  useEffect(() => {
    setSelected([]);
  },
  [data]);

  const toggleSelectAll: ReactTableApi['toggleSelectAll'] = forcedState => {
    return setSelected(state => {
      if (state.length === rows.length || forcedState === false) {
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

  // We need to mutate the rows due to how react-table work at the moment
  const mutatedRows = useMemo(
    () => {
      rows.forEach((row: Row) => {
        row.isSelected = selected.includes(row.index);
        row.toggleSelected = () => toggleSelected(row.index);
      });

      return rows;
    },
    [rows, selected, columns]
  );

  const getSelectRowToggleProps = () => ({
    onChange: toggleSelectAll,
    checked: selected.length === rows.length,
  });

  return {
    ...props,
    rows: mutatedRows,
    getSelectRowToggleProps,
    toggleSelectAll,
  };
};
