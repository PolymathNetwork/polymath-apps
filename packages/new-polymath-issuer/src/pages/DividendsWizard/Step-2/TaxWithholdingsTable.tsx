import React, { FC } from 'react';
import { HeaderColumn } from 'react-table';
import { types, formatters } from '@polymathnetwork/new-shared';
import {
  Table,
  Flex,
  Box,
  ButtonSmall,
  IconButton,
  icons,
  InlineFlex,
  Icon,
} from '@polymathnetwork/new-ui';
import {
  csvEthAddressKey,
  csvTaxWithholdingKey,
  TaxWithholdingsItem,
} from './shared';

interface Props {
  taxWithholdings: TaxWithholdingsItem[];
  handleAddNewOpen: () => void;
}

const columnsConfig: HeaderColumn[] = [
  {
    Header: 'Investor ETH Address',
    accessor: csvEthAddressKey,
    Cell: ({ value }) =>
      value && formatters.toShortAddress(value, { size: 26 }),
  },
  {
    Header: '% Tax Witholding for Associated ETH Address',
    accessor: csvTaxWithholdingKey,
    width: 250,
    Cell: ({ value }) => `${value}%`,
  },
  {
    accessor: 'actions',
    width: 80,
    Cell: cell => (
      <Table.RowActions>
        <IconButton
          Asset={icons.SvgPen}
          width="1.4rem"
          height="1.4rem"
          color="gray.2"
          onClick={() => {
            // editRow(cell.row.values);
          }}
        />
        <IconButton
          Asset={icons.SvgDelete}
          width="1.4rem"
          height="1.4rem"
          color="gray.2"
          onClick={() => {
            // deleteRow(cell.row.values.investorWalletAddress)
          }}
        />
      </Table.RowActions>
    ),
  },
];

export const TaxWithholdingsTable: FC<Props> = ({
  handleAddNewOpen,
  taxWithholdings,
}) => {
  return (
    <Table columns={columnsConfig} data={taxWithholdings} selectable>
      <Table.Toolbar>
        {() => {
          return (
            <Flex>
              <Box ml="auto">
                <ButtonSmall
                  variant="secondary"
                  iconPosition="right"
                  onClick={handleAddNewOpen}
                >
                  Update <Icon Asset={icons.SvgCycle} />
                </ButtonSmall>
                <InlineFlex ml="m">
                  <ButtonSmall iconPosition="right" onClick={handleAddNewOpen}>
                    Add new <Icon Asset={icons.SvgPlusPlain} />
                  </ButtonSmall>
                </InlineFlex>
              </Box>
            </Flex>
          );
        }}
      </Table.Toolbar>
    </Table>
  );
};
