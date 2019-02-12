import React, { FC, useContext } from 'react';
import { Row } from 'react-table';
import { Box } from '~/components/Box';
import { Button } from '~/components/Button';
import { Context } from '../Context';
import * as sc from './styles';

export interface Props {
  rows: Row[];
}

export const BatchActionsToolbar: FC<Props> = props => {
  const { toggleSelectAll, rows, children } = {
    ...useContext(Context),
    ...props,
  };
  const selectedRows = rows.filter(row => row.isSelected);

  if (!selectedRows.length) {
    return null;
  }

  return (
    <sc.BatchActionsToolbar>
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
