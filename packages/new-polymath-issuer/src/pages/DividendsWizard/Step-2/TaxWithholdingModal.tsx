import React, { FC, useState, Fragment, useEffect } from 'react';
import { types } from '@polymathnetwork/new-shared';
import { get, some, findIndex } from 'lodash';
import {
  TaxWithholdingsItem,
  csvEthAddressKey,
  csvTaxWithholdingKey,
  TaxWithholdingStatuses,
} from '~/pages/DividendsWizard/Step-2/shared';
import {
  ModalConfirm,
  Paragraph,
  FormItem,
  Grid,
  TextInput,
  PercentageInput,
} from '@polymathnetwork/new-ui';
import { FieldProps } from 'formik';

interface Props {
  isOpen: boolean;
  isEditing: boolean;
  onClose: () => void;
  taxWithholdingData?: TaxWithholdingsItem;
  existingTaxWithholdings: types.TaxWithholdingPojo[];
  fieldProps: FieldProps<any>;
}

export const TaxWithholdingModal: FC<Props> = ({
  isOpen,
  onClose,
  // taxWithholdingData,
  existingTaxWithholdings,
  isEditing,
  fieldProps,
}) => {
  const { field, form } = fieldProps;

  const onSubmit = () => {
    const isValid = !get(form.errors, field.name);
    if (!isValid) {
      return;
    }

    const value = field.value as TaxWithholdingsItem;
    const formTaxWithholdings = [
      ...form.values.taxWithholdings,
    ] as TaxWithholdingsItem[];

    const matchingIndex = findIndex(
      formTaxWithholdings,
      taxWithholding =>
        taxWithholding[csvEthAddressKey] === value[csvEthAddressKey]
    );

    const alreadyExists = matchingIndex !== -1;

    if (isEditing || alreadyExists) {
      // Mark as updated if the entry already existed and was actually updated
      const isUpdated = some(
        existingTaxWithholdings,
        existingTaxWithholding => {
          return (
            existingTaxWithholding.investorAddress ===
              value[csvEthAddressKey] &&
            value[csvTaxWithholdingKey] !== existingTaxWithholding.percentage
          );
        }
      );

      const finalValue = { ...value };

      if (isUpdated) {
        finalValue.status = TaxWithholdingStatuses.Updated;
      } else if (finalValue.status === TaxWithholdingStatuses.Updated) {
        delete finalValue.status;
      }

      formTaxWithholdings.splice(matchingIndex, 1, finalValue);
      form.setFieldValue('taxWithholdings', formTaxWithholdings);
    } else {
      const finalValue = { ...value, status: TaxWithholdingStatuses.New };

      form.setFieldValue('taxWithholdings', [
        ...formTaxWithholdings,
        finalValue,
      ]);
    }

    form.setFieldValue(field.name, {
      [csvTaxWithholdingKey]: null,
      [csvEthAddressKey]: '',
    });
    form.setFieldTouched(field.name, false);
    onClose();
  };

  // NOTE @RafaelVidaurre: Workaround to avoid broken dirty-checking
  useEffect(
    () => {
      if (!isOpen) {
        return;
      }

      form.setFieldTouched(field.name, false);

      if (!isEditing) {
        form.setFieldValue(field.name, {
          [csvEthAddressKey]: '',
          [csvTaxWithholdingKey]: null,
        });
      }
    },
    [isOpen]
  );

  return (
    <ModalConfirm
      isOpen={isOpen}
      onSubmit={onSubmit}
      onClose={onClose}
      actionButtonText="Confirm"
    >
      <ModalConfirm.Header>
        {isEditing ? 'Edit' : 'Add'} Tax Withholding for Specific Investor
      </ModalConfirm.Header>
      <Paragraph mb={0}>
        Specify the Investor's wallet address and its associated tax
        withholdings. The specified percentage will be withheld at the time
        dividends are paid.
      </Paragraph>
      <Grid mt="gridGap">
        <Fragment>
          <FormItem name={`${field.name}.${csvEthAddressKey}`}>
            <FormItem.Label>Investor ETH Address</FormItem.Label>
            <FormItem.Input component={TextInput} />
            <FormItem.Error />
          </FormItem>
          <FormItem name={`${field.name}.${csvTaxWithholdingKey}`}>
            <FormItem.Label>
              % Tax Witholding for Associated ETH Address
            </FormItem.Label>
            <FormItem.Input component={PercentageInput} />
            <FormItem.Error />
          </FormItem>
        </Fragment>
      </Grid>
    </ModalConfirm>
  );
};
