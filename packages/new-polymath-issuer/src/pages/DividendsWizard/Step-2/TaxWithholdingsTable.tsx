import React, { FC, Fragment } from 'react';
import { HeaderColumn } from 'react-table';
import { filter, remove, find, map } from 'lodash';
import { formatters } from '@polymathnetwork/new-shared';
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
  Label,
} from '@polymathnetwork/new-ui';
import {
  csvEthAddressKey,
  csvTaxWithholdingKey,
  TaxWithholdingsItem,
  TaxWithholdingStatuses,
} from './shared';

interface Props {
  taxWithholdings: TaxWithholdingsItem[];
  onAddNewOpen: () => void;
  onEdit: (csvEthAddress: string) => void;
  onDelete: (addresses: string[], isBatch: boolean) => void;
  onSubmit: () => void;
}

const makeColumnsConfig = ({ onEdit, onDelete }: Props): HeaderColumn[] => [
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
    Cell: ({ value }) => formatters.toPercent(value),
  },
  {
    Header: '',
    accessor: 'status',
    width: 150,
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
        <IconButton
          Asset={icons.SvgPen}
          width="1.4rem"
          height="1.4rem"
          color="gray.2"
          onClick={() => {
            onEdit(cell.row.values[csvEthAddressKey]);
          }}
        />
        <IconButton
          Asset={icons.SvgDelete}
          width="1.4rem"
          height="1.4rem"
          color="gray.2"
          onClick={() => {
            onDelete([cell.row.values[csvEthAddressKey]], false);
          }}
        />
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

  const columnsConfig = makeColumnsConfig(props);

  return (
    <Table columns={columnsConfig} data={filteredTaxWithholdings} selectable>
      <Table.Toolbar>
        {() => (
          <Box ml="auto">
            <ButtonSmall
              variant="secondary"
              iconPosition="right"
              onClick={() => {
                onSubmit();
              }}
            >
              Update <Icon Asset={icons.SvgCycle} />
            </ButtonSmall>
            <InlineFlex ml="m">
              <ButtonSmall iconPosition="right" onClick={onAddNewOpen}>
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

            onDelete(addresses, true);
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
