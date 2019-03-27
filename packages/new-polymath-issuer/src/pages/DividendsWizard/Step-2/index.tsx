import {
  FieldProps,
  FormikActions,
  validateYupSchema,
  yupToFormErrors,
} from 'formik';
import React, { Fragment, useState, useMemo, FC } from 'react';
import { has, merge } from 'lodash';
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
import { ConfirmModal } from './ConfirmModal';
import { TaxWithholdingModal } from './TaxWithholdingModal';
import { TaxWithholdingsTable } from './TaxWithholdingsTable';
import {
  TaxWithholdingsItem,
  csvEthAddressKey,
  csvTaxWithholdingKey,
  FormValues,
  TaxWithholdingStatuses,
} from './shared';
import { find } from 'lodash';

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
  isLoadingData: boolean;
}

const schema = validator.object().shape({
  currentTaxWithholding: validator.object().shape({
    [csvEthAddressKey]: validator
      .string()
      .isEthereumAddress('Invalid Ethereum Address')
      .isRequired('Investor ETH address is required'),
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
  isLoadingData,
}) => {
  const [csvModalOpen, setCsvModalOpen] = useState(false);

  const openCsvModal = () => {
    setCsvModalOpen(true);
  };
  const closeCsvModal = () => {
    setCsvModalOpen(false);
  };
  const downloadExistingTaxWithholdings = () => {
    downloadTaxWithholdingList(existingTaxWithholdings);
  };
  const downloadSampleTaxWithholdings = () => {
    downloadTaxWithholdingList([]);
  };
  const handleSubmit = ({ taxWithholdings }: FormValues) => {
    const filteredTaxWithholdings = taxWithholdings.filter(
      ({ status }) => !!status
    );

    const formattedValues: Array<{
      investorAddress: string;
      percentage: number;
    }> = filteredTaxWithholdings.map(value => ({
      investorAddress: value[csvEthAddressKey],
      percentage: value[csvTaxWithholdingKey],
    }));

    updateTaxWithholdingList(formattedValues);
  };

  const handleValidation = async (values: FormValues) => {
    const walletAddress = values.currentTaxWithholding[csvEthAddressKey];
    let errors = {};

    try {
      await validateYupSchema(values, schema, true);
    } catch (err) {
      errors = { ...errors, ...yupToFormErrors(err) };
    }

    // If wallet address wasn't filled yet, skip this
    if (walletAddress) {
      // Make sure wallet is existing...
      const isWalletExisting = !existingTaxWithholdings.find(
        existingTaxWithholding => {
          return (
            existingTaxWithholding.investorAddress.toUpperCase() ===
            walletAddress.toUpperCase()
          );
        }
      );

      // ...and whitelisted
      const isWalletNotExcluded = !exclusionList.includes(
        walletAddress.toUpperCase()
      );

      if (
        !has(errors, `currentTaxWithholding.${csvEthAddressKey}`) &&
        isWalletExisting &&
        isWalletNotExcluded
      ) {
        merge(errors, {
          currentTaxWithholding: {
            [csvEthAddressKey]:
              'This wallet address is not whitelisted yet. Please add it to the whitelist first.',
          },
        });
      }
    }

    throw errors;
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

  const initialTaxWithholdings = existingTaxWithholdings
    .map(taxWithhholdingItem => {
      return {
        [csvEthAddressKey]: taxWithhholdingItem.investorAddress,
        [csvTaxWithholdingKey]: taxWithhholdingItem.percentage,
      };
    })
    .filter(
      item => !exclusionList.includes(item[csvEthAddressKey].toUpperCase())
    );
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
            — % tax withholding for associated ETH address. The exact amount of
            funds to be withheld will be automatically calculated prior to
            distribution.
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
            <Icon Asset={icons.SvgDownload} /> Sample-Withholdings-Tax-List.csv
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
      <Box mt="m">
        <Remark>
          Taxes will be withheld by the dividends smart contract at the time
          dividends are distributed. Withholdings can subsequently be withdrawn
          into a designated wallet for tax payments.
          <br />
          <strong>Maximum number of entries per transaction is 10,000.</strong>
          <br />
          If you want to withhold taxes for more than 10,000 wallets, please
          breakdown the list in 10,000 wallets increments and upload them one at
          a time.
        </Remark>
      </Box>
      <FormWrapper<FormValues>
        onSubmit={handleSubmit}
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
        render={formikProps => (
          <Form
            {...formikProps}
            onSubmit={handleSubmit}
            onNextStep={onNextStep}
            existingTaxWithholdings={existingTaxWithholdings}
            csvModalOpen={csvModalOpen}
            closeCsvModal={closeCsvModal}
            isLoadingData={isLoadingData}
            exclusionList={exclusionList}
          />
        )}
      />
    </Card>
  );
};

interface FormProps {
  values: FormValues;
  setFieldValue: FormikActions<FormValues>['setFieldValue'];
  onSubmit: (values: FormValues) => void;
  onNextStep: () => void;
  existingTaxWithholdings: types.TaxWithholdingEntity[];
  csvModalOpen: boolean;
  closeCsvModal: () => void;
  isLoadingData: boolean;
  exclusionList: string[];
}

const Form: FC<FormProps> = ({
  values,
  setFieldValue,
  onNextStep,
  onSubmit,
  existingTaxWithholdings,
  csvModalOpen,
  closeCsvModal,
  isLoadingData,
  exclusionList,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [taxWithholdingModalOpen, setTaxWithholdingModalOpen] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [addressesToDelete, setAddressesToDelete] = useState<string[]>([]);
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
  const closeConfirmModal = () => {
    setConfirmModalOpen(false);
  };

  const canProceedToNextStep = values.isTaxWithholdingConfirmed;

  const filteredTaxWithholdings = useMemo(
    () =>
      values.taxWithholdings.map(taxWithholding => {
        const existingTaxWithholding = existingTaxWithholdings.find(
          currentExistingTaxWithholding =>
            currentExistingTaxWithholding.investorAddress.toUpperCase() ===
            taxWithholding[csvEthAddressKey].toUpperCase()
        );

        if (!existingTaxWithholding) {
          return taxWithholding;
        }

        // If investor percentage was set to 0
        if (
          existingTaxWithholding.percentage === 0 &&
          taxWithholding[csvTaxWithholdingKey] !== 0
        ) {
          return {
            ...taxWithholding,
            status: TaxWithholdingStatuses.New,
          };
          // ...or if investor already had a percentage set
        } else if (
          existingTaxWithholding.percentage !==
          taxWithholding[csvTaxWithholdingKey]
        ) {
          return {
            ...taxWithholding,
            status: TaxWithholdingStatuses.Updated,
          };
        }

        return taxWithholding;
      }),
    [values.taxWithholdings, existingTaxWithholdings]
  );
  const isDraft = !!filteredTaxWithholdings.find(
    ({ status }: { status?: TaxWithholdingStatuses }) => !!status
  );

  const handleEdit = (ethAddress: string) => {
    const taxWithholding = values.taxWithholdings.find(
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
    const taxWithholdingAfterDelete = values.taxWithholdings.map(
      taxWithholding => {
        const toDelete = addresses.includes(taxWithholding[csvEthAddressKey]);

        if (toDelete) {
          return {
            ...taxWithholding,
            [csvTaxWithholdingKey]: 0,
          };
        } else {
          return taxWithholding;
        }
      }
    );

    setFieldValue('taxWithholdings', taxWithholdingAfterDelete);
    closeConfirmDeleteModal();
  };

  const handleNextStep = () => {
    if (!isDraft) {
      onNextStep();
    } else {
      setConfirmModalOpen(true);
    }
  };

  return (
    <Fragment>
      <Field
        name="taxWithholdings"
        render={({ field, form }: FieldProps<TaxWithholdingsItem>) => (
          <CsvModal
            onConfirm={value => {
              // Merge CSV values with existing values
              form.setFieldValue(
                field.name,
                values.taxWithholdings.map(taxWithholding => {
                  return (
                    value.find(
                      csvTaxWithholding =>
                        csvTaxWithholding[csvEthAddressKey] ===
                        taxWithholding[csvEthAddressKey]
                    ) || taxWithholding
                  );
                })
              );
              closeCsvModal();
            }}
            isOpen={csvModalOpen}
            onClose={closeCsvModal}
          />
        )}
      />

      <Field
        name="currentTaxWithholding"
        render={(fieldProps: FieldProps<TaxWithholdingsItem>) => (
          <TaxWithholdingModal
            fieldProps={fieldProps}
            isOpen={taxWithholdingModalOpen}
            onClose={closeTaxWithhholdingModal}
            isEditing={isEditing}
            exclusionList={exclusionList}
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
        isLoadingData={isLoadingData}
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
        <Button onClick={handleNextStep} disabled={!canProceedToNextStep}>
          Proceed to the next step
        </Button>
      </Box>

      <ConfirmModal
        isOpen={confirmModalOpen}
        onConfirm={onNextStep}
        onClose={closeConfirmModal}
      />
    </Fragment>
  );
};
