import React, { useState, useCallback, FC } from 'react';
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
  ModalConfirm,
  FormItem,
  Checkbox,
  CsvUploader,
  FormWrapper,
  Text,
  LinkButton,
} from '@polymathnetwork/new-ui';
import { ExclusionEntry } from '../Presenter';

export interface Step1Props {
  onNextStep: () => void;
  excludedWallets: null | ExclusionEntry[];
  setExcludedWallets: (csv: this['excludedWallets']) => void;
  downloadSampleExclusionList: () => void;
}

interface Values {
  excludedWallets: null | ExclusionEntry[];
  noWalletExcluded: boolean;
}

export const Step1: FC<Step1Props> = ({
  onNextStep,
  excludedWallets,
  setExcludedWallets,
  downloadSampleExclusionList,
}) => {
  const [isCsvModalOpen, setCsvModalState] = useState(false);

  const handleCsvModalOpen = useCallback(() => {
    setCsvModalState(true);
  }, []);

  const handleCsvModalClose = useCallback(() => {
    setCsvModalState(false);
  }, []);

  const handleSubmit = (values: Values) => {
    // Set csv file
    setExcludedWallets(values.excludedWallets);
    onNextStep();
  };

  const validateFile = (data: Array<any>) => {
    const seen: { [key: string]: boolean } = {};
    const hasDuplicates = data.some(currentObject => {
      return (
        seen.hasOwnProperty(currentObject.data['Investor ETH Address'].value) ||
        (seen[currentObject.data['Investor ETH Address'].value] = false)
      );
    });
    return !hasDuplicates;
  };

  return (
    <FormWrapper<Values>
      initialValues={{
        noWalletExcluded: false,
        excludedWallets,
      }}
      onSubmit={handleSubmit}
      render={({ values, submitForm, setFieldValue }) => (
        <Card p="gridGap" boxShadow={1}>
          <Heading variant="h2" mb="l">
            1. Exclude Wallets from the Dividends Calculation
          </Heading>
          <Paragraph>
            Optionally exclude specific investor wallet addresses from the
            dividends calculation and distribution by uploading their address
            via a CSV which includes one wallet (ETH) address per line.
          </Paragraph>
          <Paragraph>
            You can download{' '}
            <LinkButton onClick={downloadSampleExclusionList}>
              <Icon Asset={icons.SvgDownload} /> Sample-Exclusion-List.csv
            </LinkButton>{' '}
            example file and edit it.
          </Paragraph>
          <Text color="primary">
            <Button
              variant="ghostSecondary"
              iconPosition="right"
              onClick={handleCsvModalOpen}
            >
              Upload CSV of ETH Addresses to exclude
              <Icon
                Asset={icons.SvgDownload}
                width={14}
                height={16}
                rotate="0.5turn"
              />
            </Button>
          </Text>
          <ModalConfirm
            isOpen={isCsvModalOpen}
            onSubmit={submitForm}
            onClose={() => {
              handleCsvModalClose();
              setFieldValue('excludedWallets', null);
            }}
            actionButtonText="Update list and proceed to the next step"
            isActionDisabled={!values.excludedWallets}
          >
            <ModalConfirm.Header>
              Update Wallets Exclusion List
            </ModalConfirm.Header>
            <Paragraph fontSize={2}>
              Update the wallets exclusion list by uploading a comma separated
              .CSV file.
              <br /> The format should be as follows:
              <br />
              - Investor wallet address
              <br />
              <br />
              You can download{' '}
              <LinkButton onClick={downloadSampleExclusionList}>
                <Icon Asset={icons.SvgDownload} /> Sample-Exclusion-List.csv
              </LinkButton>{' '}
              file and edit it
            </Paragraph>
            <FormItem name="excludedWallets">
              <FormItem.Input
                component={CsvUploader}
                inputProps={{
                  csvConfig: {
                    columns: [
                      {
                        name: 'Investor ETH Address',
                        validators: [
                          validators.isString,
                          validators.isEthereumAddress,
                          validators.isNotEmpty,
                        ],
                        required: true,
                      },
                    ],
                    header: true,
                    maxRows: 100,
                    strict: true,
                    validateFile,
                    customValidationErrorMessage: {
                      header: 'Duplicate Entries',
                      body:
                        'The uploaded file contains duplicate entries, please edit the file and make sure to remove the duplicate entries',
                    },
                  },
                }}
              >
                <CsvUploader.CsvErrors />
                <CsvUploader.CsvPreview
                  tableConfig={{
                    columns: [
                      {
                        accessor: 'Investor ETH Address',
                        Header: 'Investor ETH Address',
                      },
                    ],
                  }}
                />
              </FormItem.Input>
              <FormItem.Error />
            </FormItem>
          </ModalConfirm>
          <Box mt="m">
            <Remark>
              The number of tokens contained in the wallets that are excluded
              from the dividends calculation and distribution will be deducted
              from the total supply before the final percentages are calculated.
              For example, if 10 wallets each contain 1 token and 2 wallets are
              excluded from dividends, each of the remaining 8 wallets will
              receive 1/8 of the dividends
              <br />
              <strong>
                The maximum number of addresses that can be excluded is 100.
              </strong>
              <br />
              <strong>
                The wallets of Investors whose KYC/AML have expired are not
                automatically excluded and will receive dividends. These
                Investors can be excluded from the dividends calculation and
                distribution by adding their wallet address to the exclusion
                list.
              </strong>
            </Remark>
          </Box>
          <Heading variant="h3" mt="4">
            No Dividends Exclusion Required
          </Heading>
          <FormItem name="noWalletExcluded">
            <FormItem.Input
              component={Checkbox}
              inputProps={{
                label:
                  'I confirm that no wallets must be excluded from the dividends distribution.',
              }}
            />
            <FormItem.Error />
          </FormItem>
          <Box mt="xl">
            <Button disabled={!values.noWalletExcluded} onClick={submitForm}>
              Skip the step
            </Button>
          </Box>
        </Card>
      )}
    />
  );
};
