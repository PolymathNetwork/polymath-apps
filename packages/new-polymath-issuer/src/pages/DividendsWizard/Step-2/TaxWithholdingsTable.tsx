import React, { FC, Fragment } from 'react';
import { HeaderColumn } from 'react-table';
import { filter, map } from 'lodash';
import { formatters } from '@polymathnetwork/new-shared';
import {
  Table,
  Box,
  ButtonSmall,
  IconButton,
  icons,
  InlineFlex,
  Icon,
  Button,
  Label,
  TooltipPrimary,
} from '@polymathnetwork/new-ui';
import {
  csvEthAddressKey,
  csvTaxWithholdingKey,
  TaxWithholdingsItem,
} from './shared';

interface Props {
  taxWithholdings: TaxWithholdingsItem[];
  onAddNewOpen: () => void;
  onEdit: (csvEthAddress: string) => void;
  onDelete: (addresses: string[]) => void;
  onSubmit: () => void;
  transactionLimitReached?: boolean;
}

const limitReachedTooltip = () => (
  <TooltipPrimary>
    The maximum transaction limit
    <br />
    is reached, you have to click
    <br />
    on Update if you want to make
    <br />
    any more changes
  </TooltipPrimary>
);

const makeColumnsConfig = ({
  onEdit,
  onDelete,
  transactionLimitReached,
}: Props): HeaderColumn[] => [
  {
    Header: 'Investor ETH Address',
    accessor: csvEthAddressKey,
    minWidth: 250,
    Cell: ({ value }) =>
      value && formatters.toShortAddress(value, { size: 26 }),
  },
  {
    Header: '% Tax Witholding for Associated ETH Address',
    accessor: csvTaxWithholdingKey,
    minWidth: 230,
    Cell: ({ value }) => formatters.toPercent(value),
  },
  {
    Header: '',
    accessor: 'status',
    width: 80,
    Cell: ({ value }) => {
      return (
        value && (
          <Label color="greyBlue.1" bg="greyBlue.0">
            {value}
          </Label>
        )
      );
    },
  },
  {
    accessor: 'actions',
    width: 80,
    Cell: cell => (
      <Table.RowActions>
        <Box>
          <IconButton
            Asset={icons.SvgPen}
            width="1.4em"
            height="1.4em"
            color="gray.2"
            onClick={() => {
              transactionLimitReached ||
                onEdit(cell.row.values[csvEthAddressKey]);
            }}
            disabled={transactionLimitReached}
          />
          {transactionLimitReached && limitReachedTooltip()}
        </Box>
        <Box ml="s">
          <IconButton
            Asset={icons.SvgDelete}
            width="1.4em"
            height="1.4em"
            color="gray.2"
            onClick={() => {
              if (!transactionLimitReached) {
                onDelete([cell.row.values[csvEthAddressKey]]);
              }
            }}
            disabled={transactionLimitReached}
          />
          {transactionLimitReached && limitReachedTooltip()}
        </Box>
      </Table.RowActions>
    ),
  },
];

export const TaxWithholdingsTable: FC<Props> = props => {
  const { onAddNewOpen, taxWithholdings, onDelete, onSubmit } = props;
  const filteredTaxWithholdings = filter(
    taxWithholdings,
    taxWithholding =>
      taxWithholding[csvTaxWithholdingKey] > 0 || taxWithholding.status
  );
  const pendingTransactions = filter(taxWithholdings, ({ status }) => !!status)
    .length;
  const transactionLimitReached = pendingTransactions >= 10000;
  const columnsConfig = makeColumnsConfig({
    ...props,
    transactionLimitReached,
  });
  return (
    <Table
      columns={columnsConfig}
      data={
        filteredTaxWithholdings.length
          ? filteredTaxWithholdings
          : [
              {
                [csvEthAddressKey]: null,
                [csvTaxWithholdingKey]: null,
              },
            ]
      }
      selectable
    >
      <Table.Toolbar>
        {() => (
          <Box ml="auto">
            <ButtonSmall
              disabled={pendingTransactions === 0}
              variant="secondary"
              iconPosition="right"
              onClick={onSubmit}
            >
              Update <Icon Asset={icons.SvgCycle} />
            </ButtonSmall>
            <InlineFlex ml="m">
              {transactionLimitReached && limitReachedTooltip()}
              <ButtonSmall
                iconPosition="right"
                onClick={onAddNewOpen}
                disabled={transactionLimitReached}
              >
                Add new <Icon Asset={icons.SvgPlusPlain} />
              </ButtonSmall>
            </InlineFlex>
          </Box>
        )}
      </Table.Toolbar>
      <Table.BatchActionsToolbar>
        {(batchActionProps: any) => {
          const handleDeleteRows = () => {
            const addresses = map(
              batchActionProps.selectedRows,
              (row: any) => row.values[csvEthAddressKey]
            );

            onDelete(addresses);
          };

          return (
            <Fragment>
              <Button
                variant="ghost"
                iconPosition="right"
                onClick={handleDeleteRows}
                disabled={transactionLimitReached}
              >
                Delete <Icon Asset={icons.SvgDelete} width="0.7em" />
              </Button>
              {transactionLimitReached && limitReachedTooltip()}
            </Fragment>
          );
        }}
      </Table.BatchActionsToolbar>
      <Table.Rows />
      <Table.Pagination />
    </Table>
  );
};
