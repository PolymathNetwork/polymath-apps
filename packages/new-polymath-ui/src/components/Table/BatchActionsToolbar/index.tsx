import React, { FC, useContext } from 'react';
import { Box } from '~/components/Box';
import { Button } from '~/components/Button';
import { Context } from '../Context';
import * as sc from './styles';

export interface Props {
  rows?: [];
  toggleSelectAll?: () => any;
}

export const BatchActionsToolbar: FC<Props> = props => {
  const context = useContext(Context);
  const { children } = props;

  const { toggleSelectAll, rows = [] } = context || props;

  const selectedRows = rows.filter(row => row.isSelected);

  return (
    <sc.BatchActionsToolbar hidden={!selectedRows.length}>
      {children}
      <Box ml="auto">
        {selectedRows.length} items selected
        <Button
          variant="ghost"
          onClick={() => toggleSelectAll && toggleSelectAll(false)}
        >
          Cancel
        </Button>
      </Box>
    </sc.BatchActionsToolbar>
  );
};
