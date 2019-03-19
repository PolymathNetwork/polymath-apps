import { FieldProps, validateYupSchema, yupToFormErrors } from 'formik';
import React, { useState, useMemo, FC } from 'react';
import { map, find, each, filter, includes } from 'lodash';
import { types } from '@polymathnetwork/new-shared';
import {
  Box,
  Button,
  Icon,
  icons,
  Heading,
  Card,
  Paragraph,
  Remark,
  FormWrapper,
  FormItem,
  Checkbox,
  List,
  Text,
  LinkButton,
  validator,
  Field,
} from '@polymathnetwork/new-ui';
import { CsvModal } from './CsvModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
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
  existingTaxWithholdings: types.TaxWithholdingEntity[];
  downloadTaxWithholdingList: (
    taxWithholdings: types.TaxWithholdingEntity[]
  ) => void;
  updateTaxWithholdingList: (
    values: Array<{
      investorAddress: string;
      percentage: number;
    }>
  ) => void;
  nonExcludedInvestors: string[];
  exclusionList: string[];
  onTaxWithholdingListChange: (amountOfInvestors: number) => void;
}

const schema = validator.object().shape({
  currentTaxWithholding: validator.object().shape({
    [csvEthAddressKey]: validator
      .string()
      .isRequired('Investor ETH address is required')
      .isEthereumAddress('Invalid Ethereum Address'),
    [csvTaxWithholdingKey]: validator
      .number()
      .typeError('Invalid value')
      .isRequired('Tax withholding percent is required')
      .min(0, 'Cannot be lower than ${min}')
      .lessThan(1, 'Must be lower than 100'),
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
  nonExcludedInvestors,
  exclusionList,
  onTaxWithholdingListChange,
}) => {
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taxWithholdingModalOpen, setTaxWithholdingModalOpen] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [addressesToDelete, setAddressesToDelete] = useState<string[]>([]);

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
  const closeConfirmDeleteModal = () => {
    setConfirmDeleteModalOpen(false);
  };
  const openConfirmDeleteModal = () => {
    setConfirmDeleteModalOpen(true);
  };
  const handleValidation = (values: FormValues) => {
    try {
      validateYupSchema(values, schema, true);
    } catch (err) {
      const errors = yupToFormErrors(err);
      return errors;
    }
  };
  const isTaxWithholdingsItemArray = (
    entries: any
  ): entries is TaxWithholdingsItem[] => {
    return (
      Array.isArray(entries) &&
      entries.every(
        entry =>
          (typeof entry[csvEthAddressKey] === 'string' &&
            typeof entry[csvTaxWithholdingKey] === 'number' &&
            !entry.status) ||
          typeof entry.status === 'string'
      )
    );
  };

  const handleFieldChange = (field: string, value: any) => {
    if (field !== 'taxWithholdings') {
      return;
    }

    if (isTaxWithholdingsItemArray(value)) {
      let count = 0;
      nonExcludedInvestors.forEach(address => {
        const investorEntry = value.find(
          entry =>
            address.toUpperCase() === entry[csvEthAddressKey].toUpperCase()
        );

        if (investorEntry) {
          if (investorEntry[csvTaxWithholdingKey] > 0) {
            count += 1;
          }

          return;
        }

        const originalTaxWithholding = existingTaxWithholdings.find(
          ({ investorAddress }) =>
            investorAddress.toUpperCase() === address.toUpperCase()
        );

        if (originalTaxWithholding && originalTaxWithholding.percentage > 0) {
          count += 1;
        }
      });

      onTaxWithholdingListChange(count);
    } else {
      throw new Error('Invalid Tax Withholding format');
    }
  };

  const initialTaxWithholdings = filter(
    map(existingTaxWithholdings, taxWithhholdingItem => {
      return {
        [csvEthAddressKey]: taxWithhholdingItem.investorAddress,
        [csvTaxWithholdingKey]: taxWithhholdingItem.percentage,
      };
    }),
    item => !includes(exclusionList, item[csvEthAddressKey].toUpperCase())
  );

  return (
    <FormWrapper<FormValues>
      onSubmit={onSubmit}
      onFieldChange={handleFieldChange}
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
        // console.log(existingTaxWithholdings);
        // console.log(values.taxWithholdings);
        const canProceedToNextStep = values.isTaxWithholdingConfirmed;
        const filteredTaxWithholdings = values.taxWithholdings.map(
          taxWithholding => {
            const existingTaxWithholding = existingTaxWithholdings.find(
              currentExistingTaxWithholding =>
                currentExistingTaxWithholding.investorAddress.toUpperCase() ===
                taxWithholding[csvEthAddressKey].toUpperCase()
            );

            if (existingTaxWithholding) {
              if (
                existingTaxWithholding.percentage !==
                taxWithholding[csvTaxWithholdingKey]
              ) {
                return {
                  ...taxWithholding,
                  status: TaxWithholdingStatuses.Updated,
                };
              }
            } else {
              return {
                ...taxWithholding,
                status: TaxWithholdingStatuses.New,
              };
            }

            return taxWithholding;
          }
        );

        const handleEdit = (ethAddress: string) => {
          const taxWithholding = find(
            values.taxWithholdings,
            item => item[csvEthAddressKey] === ethAddress
          );

          setFieldValue('currentTaxWithholding', taxWithholding);
          setIsEditing(true);

          openTaxWithhholdingModal();
        };

        const confirmDelete = (addresses: string[]) => {
          setAddressesToDelete(addresses);
          openConfirmDeleteModal();
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
            const { investorAddress, percentage } = taxWithholding;
            const exists =
              includes(addresses, investorAddress) && percentage > 0;

            if (!exists) {
              return;
            }

            modifiedItems.unshift({
              status: TaxWithholdingStatuses.Updated,
              [csvEthAddressKey]: investorAddress,
              [csvTaxWithholdingKey]: 0,
            });
          });

          setFieldValue('taxWithholdings', modifiedItems);
          closeConfirmDeleteModal();
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
                  — % tax withholding for associated ETH address. The exact
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
            <Text color="primary">
              <Button
                variant="ghostSecondary"
                iconPosition="right"
                onClick={openCsvModal}
              >
                Upload Tax Withholdings List
                <Icon
                  Asset={icons.SvgDownload}
                  width={14}
                  height={16}
                  rotate="0.5turn"
                />
              </Button>
            </Text>
            <Field
              name="taxWithholdings"
              render={({ field, form }: FieldProps<TaxWithholdingsItem>) => (
                <CsvModal
                  onConfirm={value => {
                    form.setFieldValue(field.name, value);
                    closeCsvModal();
                  }}
                  existingTaxWithholdings={existingTaxWithholdings}
                  isOpen={csvModalOpen}
                  onClose={closeCsvModal}
                />
              )}
            />
            <Box mt="m">
              <Remark>
                Taxes will be withheld by the dividends smart contract at the
                time dividends are distributed. Withholdings can subsequently be
                withdrawn into a designated wallet for tax payments.
                <br />
                <strong>
                  Maximum number of entries per transaction is 10,000.
                </strong>
                <br />
                If you want to withhold taxes for more than 10,000 wallets,
                please breakdown the list in 10,000 wallets increments and
                upload them one at a time.
              </Remark>
            </Box>

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

            <DeleteConfirmModal
              isOpen={confirmDeleteModalOpen}
              onConfirm={() => handleDelete(addressesToDelete)}
              onClose={closeConfirmDeleteModal}
              addresses={addressesToDelete}
            />

            <Heading variant="h3" mt="4">
              Tax Withholdings List
            </Heading>
            <TaxWithholdingsTable
              onSubmit={() => {
                onSubmit({
                  ...values,
                  taxWithholdings: filteredTaxWithholdings,
                });
              }}
              onEdit={handleEdit}
              onAddNewOpen={openTaxWithhholdingModal}
              taxWithholdings={filteredTaxWithholdings}
              onDelete={confirmDelete}
            />
            <Heading variant="h3" mt="4">
              Confirm Tax Withholdings
            </Heading>
            <FormItem name="isTaxWithholdingConfirmed">
              <FormItem.Input
                component={Checkbox}
                inputProps={{
                  label:
                    'I confirm that the Tax Withholdings above are correct and should be applied to this dividends distribution.',
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
