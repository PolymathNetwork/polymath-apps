import React, { FC, useContext } from 'react';
import { Api } from 'react-table';
import { Box } from '~/components/Box';
import { Button } from '~/components/Button';
import { Context } from '../Context';
import * as sc from './styles';

export interface Props extends Api {}

export const BatchActionsToolbar: FC<Props> = props => {
  const { toggleSelectAll, rows, children } = {
    ...useContext(Context),
    ...props,
  };
  const selectedRows = rows.filter(row => row.isSelected);

  return (
    <sc.BatchActionsToolbar hidden={!selectedRows.length}>
      {children}
      <Box ml="auto">
        {selectedRows.length} items selected
        <Button variant="ghost" onClick={() => toggleSelectAll(false)}>
          Cancel
        </Button>
      </Box>
    </sc.BatchActionsToolbar>
  );
};
