import React, { FC, useContext } from 'react';
import { Box } from '~/components/Box';
import { ButtonSmall } from '~/components/ButtonSmall';
import { Context } from '../Context';
import * as sc from './styles';
import { Row } from '../index';

export interface Props {
  rows?: Row[];
  toggleSelectAll?: () => any;
}

export const BatchActionsToolbar: FC<Props> = props => {
  const context = useContext(Context);
  const { children } = props;

  const { toggleSelectAll, rows = [] } = context || props;

  const selectedRows = rows.filter((row: Row) => row.isSelected);

  return (
    <sc.BatchActionsToolbar hidden={!selectedRows.length}>
      {typeof children === 'function'
        ? children({ ...context, selectedRows })
        : children}
      <Box ml="auto">
        {selectedRows.length} items selected
        <ButtonSmall
          variant="ghost"
          onClick={() => toggleSelectAll && toggleSelectAll(false)}
        >
          Cancel
        </ButtonSmall>
      </Box>
    </sc.BatchActionsToolbar>
  );
};
