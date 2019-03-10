import { FieldProps } from 'formik';
import React, { Fragment, useState, useCallback, FC } from 'react';
import { map } from 'lodash';
import {
  validators,
  formatters,
  csvParser,
  utils,
  types,
} from '@polymathnetwork/new-shared';
import {
  Box,
  Button,
  ButtonSmall,
  Icon,
  icons,
  Heading,
  Card,
  Paragraph,
  Remark,
  Flex,
  InlineFlex,
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
  IconButton,
  TextInput,
  PercentageInput,
  validator,
  Field,
} from '@polymathnetwork/new-ui';
import { CsvModal } from './CsvModal';
import { TaxWithholdingModal } from './TaxWithholdingModal';
import { TaxWithholdingsTable } from './TaxWithholdingsTable';
import {
  TaxWithholdingsItem,
  csvEthAddressKey,
  csvTaxWithholdingKey,
  PartialTaxWithholdingsItem,
} from './shared';

interface Props {
  onNextStep: () => void;
  existingTaxWithholdings: types.TaxWithholdingPojo[];
  downloadTaxWithholdingList: (
    taxWithholdings: types.TaxWithholdingPojo[]
  ) => void;
}

interface Values {
  taxWithholdings: TaxWithholdingsItem[];
  newTaxWithholding: PartialTaxWithholdingsItem;
}

/**
 * 1. There is ONE taxWithholdings list that we manage
 * 2. This list is values.taxWithholdings list
 */

export const Step2: FC<Props> = ({
  onNextStep,
  existingTaxWithholdings,
  downloadTaxWithholdingList,
}) => {
  const onSubmit = (values: Values) => {
    console.log('values', values);
  };

  const downloadExistingTaxWithholdings = () => {
    downloadTaxWithholdingList(existingTaxWithholdings);
  };

  // NOTE: This never happens since by default two taxWithholdings already exist
  const downloadSampleTaxWithholdings = () => {
    downloadTaxWithholdingList([]);
  };

  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [taxWithholdingModalOpen, setTaxWithholdingModalOpen] = useState(false);

  const openCsvModal = () => {
    setCsvModalOpen(true);
  };
  const closeCsvModal = () => {
    setCsvModalOpen(false);
  };
  const openTaxWithhholdingModal = () => {
    setTaxWithholdingModalOpen(true);
  };
  const closeTaxWithhholdingModal = () => {
    setTaxWithholdingModalOpen(false);
  };

  const initialTaxWithholdings = map(
    existingTaxWithholdings,
    taxWithhholdingItem => {
      return {
        [csvEthAddressKey]: taxWithhholdingItem.investorAddress,
        [csvTaxWithholdingKey]: taxWithhholdingItem.percentage,
      };
    }
  );

  return (
    <Form<Values>
      onSubmit={onSubmit}
      initialValues={{
        taxWithholdings: initialTaxWithholdings,
        newTaxWithholding: {
          '% Tax Withholding': null,
          'Investor ETH Address': '',
        },
      }}
      render={({ values, setFieldValue }) => {
        console.log('values', values);
        const addTaxWithholding = () => {
          // setFieldValue();
        };
        return (
          <Card p="gridGap" boxShadow={1}>
            <Heading variant="h2" mb="l">
              2. Add/Update Tax Withholdings List
            </Heading>
            <Paragraph>
              Optionally withhold taxes for applicable investor wallet addresses
              by uploading a CSV which includes, for investors subject to tax
              withholdings:{' '}
            </Paragraph>
            <List vertical gridGap={0}>
              <li>
                <Text>— Investor wallet's ETH Address;</Text>
              </li>
              <li>
                <Text>
                  — % tax witholding for associated ETH address. The exact
                  amount of funds to be withheld will be automatically
                  calculated prior to distribution.
                </Text>
              </li>
            </List>
            {existingTaxWithholdings.length ? (
              <Paragraph>
                You can download{' '}
                <LinkButton onClick={downloadExistingTaxWithholdings}>
                  <Icon Asset={icons.SvgDownload} />{' '}
                  Existing-Withholdings-Tax-List.csv
                </LinkButton>{' '}
                file and edit it.
              </Paragraph>
            ) : (
              <Paragraph>
                You can download{' '}
                <button onClick={downloadSampleTaxWithholdings}>
                  <Icon Asset={icons.SvgDownload} />{' '}
                  Sample-Withholdings-Tax-List.csv
                </button>{' '}
                example file and edit it.
              </Paragraph>
            )}
            <Button
              variant="ghostSecondary"
              iconPosition="right"
              onClick={openCsvModal}
            >
              Upload Tax Withholdings List
              <Icon Asset={icons.SvgDownload} width={18} height={18} />
            </Button>
            <Field
              name="taxWithholdings"
              render={({ field, form }: FieldProps) => (
                <CsvModal
                  onConfirm={value => {
                    form.setFieldValue(field.name, value);
                    closeCsvModal();
                  }}
                  isOpen={csvModalOpen}
                  onClose={closeCsvModal}
                  formTaxWithholdings={field.value}
                />
              )}
            />
            <Remark>
              Taxes will be withheld by the dividends smart contract at the time
              dividends are distributed. Withholdings can subsequently be
              withdrawn into a designated wallet for tax payments.
              <br />
              <strong>Maximum number of entries per transaction is 200.</strong>
              <br />
              If you want to withhold taxes for more than 200 wallets, please
              breakdown the list in 200 wallets increments and upload them one
              at a time.
            </Remark>

            <Field
              name="newTaxWithholding"
              render={({
                field,
                form,
              }: FieldProps<Values['newTaxWithholding']>) => (
                <TaxWithholdingModal
                  onConfirm={value => {
                    form.setFieldValue(field.name, value);
                  }}
                  isOpen={taxWithholdingModalOpen}
                  onClose={closeTaxWithhholdingModal}
                />
              )}
            />

            <TaxWithholdingsTable
              handleAddNewOpen={openTaxWithhholdingModal}
              taxWithholdings={values.taxWithholdings}
            />
          </Card>
        );
      }}
    />
  );
};
