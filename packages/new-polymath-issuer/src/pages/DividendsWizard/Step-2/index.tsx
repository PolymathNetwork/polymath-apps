import React, { Fragment, useState, useCallback } from 'react';
import { validators, formatters } from '@polymathnetwork/new-shared';

import {
  Box,
  Button,
  Icon,
  icons,
  Heading,
  Card,
  Paragraph,
  Remark,
  Form,
  FormItem,
  Checkbox,
  List,
  Grid,
  CsvUploader,
  ModalConfirm,
  Table,
  Label,
  LinkButton,
  Text,
} from '@polymathnetwork/new-ui';

export interface Props {
  onSubmitStep: () => void;
  values: any;
  taxWithholdings: types.TaxWithholdingEntity[];
}

export const Step2 = ({ onSubmitStep, values, taxWithholdings }: Props) => {
  const [isCsvModalOpen, setCsvModalState] = useState(false);
  const [withholdingList, setWithholdingList] = useState(
    taxWithholdings
      ? taxWithholdings.map(item => {
          return {
            'Investor ETH Address': item.investorAddress,
            '% Tax Witholding for Associated ETH Address': item.percentage,
          };
        })
      : []
  );

  const columns = [
    {
      Header: 'Investor ETH Address',
      accessor: 'investorWalletAddress',
    },
    {
      Header: '% Tax Witholding for Associated ETH Address',
      accessor: 'withholdingPercent',
    },
  ];

  const handleCsvModalOpen = useCallback(() => {
    setCsvModalState(true);
  }, []);

  const handleCsvModalClose = useCallback(() => {
    setCsvModalState(false);
  }, []);

  const handleCsvModalConfirm = useCallback(() => {
    const addedEntries = values.map(csvRow => {
      return { investorWalletAddress: 1, withholdingPercent: 13 };
    });
    setWithholdingList({ ...withholdingList, ...addedEntries });
    setCsvModalState(false);
  }, []);

  const downloadExistingWithholdings = () => {
    utils.downloadCsvFile(
      withholdingList,
      ' Existing-Withholdings-Tax-List.csv',
      { fields: ['Investor ETH Address', '% of Tax Withholding'] }
    );
  };

  return (
    <Card p="gridGap" boxShadow={1}>
      <Heading variant="h2" mb="l">
        2. Add/Update Tax Withholdings List
      </Heading>
      <Paragraph>
        Optionally withhold taxes for applicable investor wallet addresses by
        uploading a CSV which includes, for investors subject to tax
        withholdings:{' '}
        <List vertical gridGap={0}>
          <li>— Investor wallet's ETH Address;</li>
          <li>
            — % tax witholding for associated ETH address. The exact amount of
            funds to be withheld will be automatically calculated prior to
            distribution.
          </li>
        </List>
      </Paragraph>
      <Paragraph>
        You can download{' '}
        <LinkButton onClick={downloadExistingWithholdings}>
          <Icon Asset={icons.SvgDownload} /> Existing-Withholdings-Tax-List.csv
        </LinkButton>{' '}
        file and edit it.
      </Paragraph>
      <Button
        variant="ghostSecondary"
        iconPosition="right"
        onClick={handleCsvModalOpen}
      >
        Upload Tax Withholings List
        <Icon Asset={icons.SvgDownload} width={18} height={18} />
      </Button>
      <ModalConfirm
        isOpen={isCsvModalOpen}
        onSubmit={handleCsvModalConfirm}
        onClose={handleCsvModalClose}
        actionButtonText="Confirm"
        isActionDisabled={!values.excludedWalletsCsv}
      >
        <ModalConfirm.Header>Upload Tax Withholding List</ModalConfirm.Header>
        <Paragraph fontSize={2}>
          For tax withholdings, the format should be as follows:
          <List vertical gridGap={0}>
            <li>— Investor wallet's ETH Address;</li>
            <li>
              — % tax witholding for associated ETH address. The exact amount of
              funds to be withheld will be automatically calculated prior to
              distribution.
            </li>
          </List>
        </Paragraph>
        <Grid>
          <FormItem name="excludedWalletsCsv">
            <FormItem.Input
              component={CsvUploader}
              inputProps={{
                csvConfig: {
                  columns: [
                    {
                      name: columns[0].Header,
                      validators: [
                        validators.isEthereumAddress,
                        validators.isNotEmpty,
                      ],
                      required: true,
                    },
                    {
                      name: columns[1].Header,
                      validators: [validators.isString, validators.isNotEmpty],
                      required: true,
                    },
                  ],
                  header: true,
                  maxRows: 200,
                },
              }}
            >
              <CsvUploader.CsvErrors />
              <CsvUploader.CsvPreview
                tableConfig={{
                  columns: [
                    {
                      accessor: columns[0].Header,
                      Header: columns[0].Header,
                      Cell: ({ value }) =>
                        formatters.toShortAddress(value, { size: 26 }),
                    },
                    {
                      accessor: columns[1].Header,
                      Header: columns[1].Header,
                    },
                  ],
                }}
              />
            </FormItem.Input>
            <FormItem.Error />
          </FormItem>
        </Grid>
      </ModalConfirm>
      <Remark>
        Taxes will be withheld by the dividends smart contract at the time
        dividends are distributed. Withholdings can subsequently be withdrawn
        into a designated wallet for tax payments.
        <br />
        <strong>Maximum number of entries per transaction is 200.</strong>
        <br />
        If you want to withhold taxes for more than 200 wallets, please
        breakdown the list in 200 wallets increments and upload them one at a
        time.
      </Remark>
      <Box mt="m" mb="m">
        <Table columns={columns} data={withholdingList} selectable>
          <Table.BatchActionsToolbar>
            <Button variant="ghost" iconPosition="right" onClick={() => {}}>
              Delete <Icon Asset={icons.SvgDelete} />
            </Button>
          </Table.BatchActionsToolbar>
          <Table.Rows />
          <Table.Pagination />
        </Table>
      </Box>
      <Heading variant="h3" mt="m">
        No Changes Required
      </Heading>
      <Paragraph>
        Please make sure to confirm no changes are required by downloading and
        reviewing the current configuration.
      </Paragraph>
      <Form
        initialValues={{
          noWalletExcluded: false,
        }}
        onSubmit={() => {}}
        render={({ handleSubmit, isValid }) => (
          <Fragment>
            <FormItem name="walletAddress">
              <FormItem.Input
                component={Checkbox}
                inputProps={{
                  label:
                    'I’m sure I don’t need any adds/updates to the Tax Withholdings List.',
                }}
              />
              <FormItem.Error />
            </FormItem>
            <Box mt="xl">
              <Button onClick={onSubmitStep}>
                Update list and proceed to the next step
              </Button>
            </Box>
          </Fragment>
        )}
      />
    </Card>
  );
};
