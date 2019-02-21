import React, { FC, useContext } from 'react';
import { UsePaginationValues } from 'react-table';
import { Icon } from '~/components/Icon';
import { Flex } from '~/components/Flex';
import { Box } from '~/components/Box';
import { SelectPrimitive as Select } from '~/components/inputs/Select';
import { SvgCaretDown2 } from '~/images/icons/CaretDown2';
import { Context } from '../Context';
import * as sc from './styles';

export interface Props extends UsePaginationValues {
  state: [{ pageIndex: number; pageSize: number }];
}

export const Pagination: FC<Props> = props => {
  const {
    pageOptions,
    state: [{ pageIndex, pageSize }],
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  } = { ...useContext(Context), ...props };

  return (
    <sc.Pagination>
      <Box ml="m">Items per page:</Box>
      <Select
        variant="ghost"
        onChange={setPageSize}
        options={[10, 20, 30, 40, 50].map(option => ({
          label: option,
          value: option,
        }))}
        value={pageSize}
      />
      <Flex ml="auto">
        <Box mr="m">
          Page {pageIndex + 1} of {pageOptions.length}
        </Box>
        <sc.ButtonPreviousPage
          onClick={previousPage}
          disabled={!canPreviousPage}
          variant="ghost"
        >
          <Icon Asset={SvgCaretDown2} width="1em" height="1em" />
        </sc.ButtonPreviousPage>
        <Select
          variant="ghost"
          onChange={gotoPage}
          options={pageOptions.map(option => ({
            label: option + 1,
            value: option,
          }))}
          value={pageIndex}
        />
        <sc.ButtonNextPage
          onClick={nextPage}
          disabled={!canNextPage}
          variant="ghost"
        >
          <Icon Asset={SvgCaretDown2} width="1em" height="1em" />
        </sc.ButtonNextPage>
      </Flex>
    </sc.Pagination>
  );
};
