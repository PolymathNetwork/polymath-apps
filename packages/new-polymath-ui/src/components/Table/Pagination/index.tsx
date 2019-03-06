import React, { FC, useContext, useState } from 'react';
import { uniqueId } from 'lodash';
import { UsePaginationValues } from 'react-table';
import { Icon } from '~/components/Icon';
import { Flex } from '~/components/Flex';
import { Box } from '~/components/Box';
import { SelectPrimitive as Select } from '~/components/inputs/Select';
import { SvgCaretDown2 } from '~/images/icons/CaretDown2';
import { Context } from '../Context';
import * as sc from './styles';

export interface Props {}

export const Pagination: FC<Props> = props => {
  const context = useContext(Context);

  if (!context) {
    return null;
  }

  const {
    pageOptions,
    state: [{ pageIndex, pageSize }],
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  } = context;
  const [itemsPerPageSelectId] = useState(uniqueId());
  const [pageSelectId] = useState(uniqueId());

  return (
    <sc.Pagination>
      <Box as="label" ml="m" htmlFor={itemsPerPageSelectId}>
        Items per page
      </Box>
      :
      <Select
        variant="ghost"
        onChange={setPageSize}
        options={[10, 20, 30, 40, 50].map(option => ({
          label: option,
          value: option,
        }))}
        value={pageSize}
        name={itemsPerPageSelectId}
        className="items-per-page-select"
      />
      <Flex ml="auto">
        <Box as="label" mr="m" htmlFor={pageSelectId}>
          Page {pageIndex + 1} of {pageOptions.length}
        </Box>
        <sc.ButtonPreviousPage
          onClick={previousPage}
          disabled={!canPreviousPage}
          variant="ghost"
          aria-label="Previous page"
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
          name={pageSelectId}
        />
        <sc.ButtonNextPage
          onClick={nextPage}
          disabled={!canNextPage}
          variant="ghost"
          aria-label="Next page"
        >
          <Icon Asset={SvgCaretDown2} width="1em" height="1em" />
        </sc.ButtonNextPage>
      </Flex>
    </sc.Pagination>
  );
};
