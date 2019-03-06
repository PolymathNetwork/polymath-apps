import React, { Fragment, useState, useCallback } from 'react';
import { validators } from '@polymathnetwork/new-shared';

import {
  Box,
  Button,
  Icon,
  icons,
  Heading,
  Card,
  Paragraph,
  Link,
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
} from '@polymathnetwork/new-ui';

export interface Props {
  onSubmitStep: () => void;
  values: any;
}

export const Step2 = ({ onSubmitStep, values }: Props) => {
  const [isCsvModalOpen, setCsvModalState] = useState(false);
  const [isResultsShown, setResultsShown] = useState(false);

  const columns = [
    {
      Header: 'Investor Wallet Address',
      accessor: 'investorWalletAddress',
      Cell: ({ value }: { value: string }) => {
        return <Link href="#">{value}</Link>;
      },
    },
    {
      Header: 'Dividends Pre-Tax',
      accessor: 'dividendsPreTax',
    },
    {
      Header: 'Taxes Withheld (%)',
      accessor: 'taxesWithheldPercent',
    },
    {
      Header: 'Taxes Withheld (TOKEN)',
      accessor: 'taxesWithheldTokens',
    },
    {
      Header: 'Dividends Paid',
      accessor: 'dividendsPaid',
    },
    {
      Header: 'Status of Payment',
      accessor: 'statusOfPayment',
      Cell: ({ value }: { value: string }) => (
        <Label color="green.1">{value}</Label>
      ),
    },
  ];

  const handleCsvModalOpen = useCallback(() => {
    setCsvModalState(true);
  }, []);

  const handleCsvModalClose = useCallback(() => {
    setCsvModalState(false);
  }, []);

  const handleCsvModalConfirm = useCallback(() => {
    setResultsShown(true);
    setCsvModalState(false);
  }, []);

  console.log(values);
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
        <Link href="" download>
          <Icon Asset={icons.SvgDownload} /> Sample-Excluding-List.csv
        </Link>{' '}
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
                config: {
                  columns: [
                    {
                      name: 'Investor Eth Address',
                      validators: [
                        validators.isEthereumAddress,
                        validators.isNotEmpty,
                      ],
                      required: true,
                    },
                    {
                      name: '% of Tax Withholding',
                      validators: [validators.isString, validators.isNotEmpty],
                      required: true,
                    },
                  ],
                  header: true,
                  maxRows: 200,
                  missingRequiredColumnsErrorMessage:
                    'Some required columns do not exist in the CSV',
                  extraColumnsErrorMessage:
                    'the CSV file contains extra columns',
                  rowsExceedMaxLimitErrorMessage:
                    'The CSV file contains more columns than the maximum limit',
                },
              }}
            />
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
      {isResultsShown && <Table columns={columns} />}
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
                label="I’m sure I don’t need any adds/updates to the Tax Withholdings List."
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
