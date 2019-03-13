import React, { FC, useContext } from 'react';
import { Button } from '~/components/Button';
import { Text } from '~/components/Text';
import { Box } from '~/components/Box';
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
      <Box ml="auto" textAlign="right" height="100%">
        <Text mr="m">{selectedRows.length} items selected</Text>
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
