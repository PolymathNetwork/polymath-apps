import React, { FC, Fragment } from 'react';
import { HeaderColumn } from 'react-table';
import { filter } from 'lodash';
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
  Button,
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
  const filteredTaxWithholdings = filter(
    taxWithholdings,
    taxWithholding => taxWithholding['% Tax Withholding'] > 0
  );

  return (
    <Table columns={columnsConfig} data={filteredTaxWithholdings} selectable>
      <Table.Toolbar>
        {() => {
          return (
            <Flex>
              <Box ml="auto">
                <ButtonSmall
                  variant="secondary"
                  iconPosition="right"
                  onClick={() => {}}
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
      <Table.BatchActionsToolbar>
        {(batchActionProps: any) => {
          const handleDeleteRows = () => {
            // setWithholdingList(
            //   _.remove(withholdingList, item => {
            //     return _.find(batchActionProps.selectedRows, o => {
            //       return (
            //         o.values.investorWalletAddress !==
            //         item.investorWalletAddress
            //       );
            //     });
            //   })
            // );
          };

          return (
            <Fragment>
              <Button
                variant="ghost"
                iconPosition="right"
                onClick={handleDeleteRows}
              >
                Delete <Icon Asset={icons.SvgDelete} />
              </Button>
            </Fragment>
          );
        }}
      </Table.BatchActionsToolbar>
      <Table.Rows />
      <Table.Pagination />
    </Table>
  );
};
