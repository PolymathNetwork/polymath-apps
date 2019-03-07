import React, { Fragment, useState, useCallback } from 'react';
import { validators, formatters, types } from '@polymathnetwork/new-shared';
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
  Text,
  Link,
  LinkButton,
} from '@polymathnetwork/new-ui';

export interface Props {
  onSubmitStep: () => void;
  values: any;
  taxWithholdings: types.TaxWithholdingEntity[];
}

export const Step2 = ({ onSubmitStep, values, taxWithholdings }: Props) => {
  const [isCsvModalOpen, setCsvModalState] = useState(false);
  const [withholdingList, setWithholdingList] = useState(
    taxWithholdings.map(item => {
      return {
        investorWalletAddress: item.investorAddress,
        withholdingPercent: item.percentage,
      };
    })
  );

  const columns = [
    {
      Header: 'Investor ETH Address',
      accessor: 'investorWalletAddress',
    },
    {
      Header: '% Tax Witholding for Associated ETH Address',
      accessor: 'withholdingPercent',
      Cell: ({ value }) => `${value}%`,
    },
  ];

  const handleCsvModalOpen = useCallback(() => {
    setCsvModalState(true);
  }, []);

  const handleCsvModalClose = useCallback(() => {
    setCsvModalState(false);
  }, []);

  const handleCsvModalConfirm = useCallback(
    () => {
      const addedEntries = values.taxWithholdingsCsv.map(csvRow => ({
        investorWalletAddress: csvRow.data.investorWalletAddress.value,
        withholdingPercent: csvRow.data.withholdingPercent.value,
      }));
      setWithholdingList([...withholdingList, ...addedEntries]);
      setCsvModalState(false);
    },
    [values]
  );

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
      </Paragraph>
      <List vertical gridGap={0}>
        <li>
          <Text>— Investor wallet's ETH Address;</Text>
        </li>
        <li>
          <Text>
            — % tax witholding for associated ETH address. The exact amount of
            funds to be withheld will be automatically calculated prior to
            distribution.
          </Text>
        </li>
      </List>
      {withholdingList.length ? (
        <Paragraph>
          You can download{' '}
          <LinkButton onClick={downloadExistingWithholdings}>
            <Icon Asset={icons.SvgDownload} />{' '}
            Existing-Withholdings-Tax-List.csv
          </LinkButton>{' '}
          file and edit it.
        </Paragraph>
      ) : (
        <Paragraph>
          You can download{' '}
          <Link href="" download>
            <Icon Asset={icons.SvgDownload} /> Sample-Withholdings-Tax-List.csv
          </Link>{' '}
          example file and edit it.
        </Paragraph>
      )}
      <Button
        variant="ghostSecondary"
        iconPosition="right"
        onClick={handleCsvModalOpen}
      >
        Upload Tax Withholdings List
        <Icon Asset={icons.SvgDownload} width={18} height={18} />
      </Button>
      <ModalConfirm
        isOpen={isCsvModalOpen}
        onSubmit={handleCsvModalConfirm}
        onClose={handleCsvModalClose}
        actionButtonText="Confirm"
        isActionDisabled={!values.taxWithholdingsCsv}
      >
        <ModalConfirm.Header>Upload Tax Withholding List</ModalConfirm.Header>
        <Paragraph mb={0}>
          For tax withholdings, the format should be as follows:
        </Paragraph>
        <List vertical gridGap={0}>
          <li>
            <Text>— Investor wallet's ETH Address;</Text>
          </li>
          <li>
            <Text>
              — % tax witholding for associated ETH address. The exact amount of
              funds to be withheld will be automatically calculated prior to
              distribution.
            </Text>
          </li>
        </List>
        <Grid mt="gridGap">
          <FormItem name="taxWithholdingsCsv">
            <FormItem.Input
              component={CsvUploader}
              inputProps={{
                csvConfig: {
                  columns: [
                    {
                      name: columns[0].accessor,
                      validators: [
                        validators.isEthereumAddress,
                        validators.isNotEmpty,
                      ],
                      required: true,
                    },
                    {
                      name: columns[1].accessor,
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
                      accessor: columns[0].accessor,
                      Header: columns[0].Header,
                      Cell: ({ value }) =>
                        formatters.toShortAddress(value, { size: 26 }),
                    },
                    {
                      accessor: columns[1].accessor,
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
      {!!withholdingList.length && (
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
      )}
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
