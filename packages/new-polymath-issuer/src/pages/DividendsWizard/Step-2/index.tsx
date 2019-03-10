import {
  FieldProps,
  FieldArray,
  validateYupSchema,
  yupToFormErrors,
} from 'formik';
import React, { Fragment, useState, useCallback, FC } from 'react';
import { map, find, each, some, filter, includes } from 'lodash';
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
  FormValues,
  TaxWithholdingStatuses,
} from './shared';

interface Props {
  onNextStep: () => void;
  existingTaxWithholdings: types.TaxWithholdingPojo[];
  downloadTaxWithholdingList: (
    taxWithholdings: types.TaxWithholdingPojo[]
  ) => void;
  updateTaxWithholdingList: (
    values: Array<{
      investorAddress: string;
      percentage: number;
    }>
  ) => void;
}

const schema = validator.object().shape({
  currentTaxWithholding: validator.object().shape({
    [csvEthAddressKey]: validator
      .string()
      .required('Investor ETH address is required')
      .isEthereumAddress('Invalid Ethereum Address'),
    [csvTaxWithholdingKey]: validator
      .number()
      .typeError('Invalid value')
      .min(0, 'Invalid value')
      .max(100, 'Invalid value')
      .required('Tax withholding percent is required'),
  }),
});

/**
 * - Deleted rows of existing tax withholdings are edited to 0 instead
 * - Filter 0% rows unless their existing value != 0 (these are marked as updated in the table)
 * -
 */

export const Step2: FC<Props> = ({
  onNextStep,
  existingTaxWithholdings,
  downloadTaxWithholdingList,
  updateTaxWithholdingList,
}) => {
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taxWithholdingModalOpen, setTaxWithholdingModalOpen] = useState(false);

  const onSubmit = ({ taxWithholdings }: FormValues) => {
    const filteredTaxWithholdings = filter(
      taxWithholdings,
      ({ status }) => !!status
    );

    const formattedValues: Array<{
      investorAddress: string;
      percentage: number;
    }> = map(filteredTaxWithholdings, value => ({
      investorAddress: value[csvEthAddressKey],
      percentage: value[csvTaxWithholdingKey],
    }));

    updateTaxWithholdingList(formattedValues);
  };
  const downloadExistingTaxWithholdings = () => {
    downloadTaxWithholdingList(existingTaxWithholdings);
  };
  // NOTE: At this point this never happens since by default two
  // taxWithholdings already exist
  const downloadSampleTaxWithholdings = () => {
    downloadTaxWithholdingList([]);
  };
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
    setIsEditing(false);
  };
  const handleValidation = (values: FormValues) => {
    try {
      validateYupSchema(values, schema, true);
    } catch (err) {
      const errors = yupToFormErrors(err);
      return errors;
    }
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
    <Form<FormValues>
      onSubmit={onSubmit}
      validate={handleValidation}
      initialValues={{
        taxWithholdings: initialTaxWithholdings,
        isTaxWithholdingConfirmed: false,
        currentTaxWithholding: {
          [csvEthAddressKey]: '',
          [csvTaxWithholdingKey]: null,
        },
      }}
      render={({ values, setFieldValue }) => {
        const canProceedToNextStep = values.isTaxWithholdingConfirmed;

        const handleEdit = (ethAddress: string) => {
          const taxWithholding = find(
            values.taxWithholdings,
            item => item[csvEthAddressKey] === ethAddress
          );

          setFieldValue('currentTaxWithholding', taxWithholding);
          setIsEditing(true);

          openTaxWithhholdingModal();
        };

        const handleDelete = (addresses: string[]) => {
          // Remove all matching items
          const modifiedItems = filter(
            values.taxWithholdings,
            taxWithholding =>
              !includes(addresses, taxWithholding[csvEthAddressKey])
          );
          // Add back items that already existed, but marked as 0%
          each(existingTaxWithholdings, taxWithholding => {
            const exists = includes(addresses, taxWithholding.investorAddress);

            if (!exists) {
              return;
            }

            modifiedItems.unshift({
              status: TaxWithholdingStatuses.Updated,
              [csvEthAddressKey]: taxWithholding.investorAddress,
              [csvTaxWithholdingKey]: 0,
            });
          });

          setFieldValue('taxWithholdings', modifiedItems);
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
                <LinkButton onClick={downloadSampleTaxWithholdings}>
                  <Icon Asset={icons.SvgDownload} />{' '}
                  Sample-Withholdings-Tax-List.csv
                </LinkButton>{' '}
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
              render={({ field, form }: FieldProps<TaxWithholdingsItem>) => (
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
              name="currentTaxWithholding"
              render={(fieldProps: FieldProps<TaxWithholdingsItem>) => (
                <TaxWithholdingModal
                  existingTaxWithholdings={existingTaxWithholdings}
                  fieldProps={fieldProps}
                  isOpen={taxWithholdingModalOpen}
                  onClose={closeTaxWithhholdingModal}
                  isEditing={isEditing}
                />
              )}
            />
            <TaxWithholdingsTable
              onSubmit={() => {
                onSubmit(values);
              }}
              onEdit={handleEdit}
              onAddNewOpen={openTaxWithhholdingModal}
              taxWithholdings={values.taxWithholdings}
              onDelete={handleDelete}
            />
            <Heading variant="h3" mt="m">
              Confirm Tax Withholdings
            </Heading>
            <Paragraph>
              Please make sure to confirm no changes are required by downloading
              and reviewing the current configuration.
            </Paragraph>
            <FormItem name="isTaxWithholdingConfirmed">
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
              <Button onClick={onNextStep} disabled={!canProceedToNextStep}>
                Update list and proceed to the next step
              </Button>
            </Box>
          </Card>
        );
      }}
    />
  );
};
