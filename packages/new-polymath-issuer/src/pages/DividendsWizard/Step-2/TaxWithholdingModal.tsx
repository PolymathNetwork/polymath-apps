import React, { FC, useState } from 'react';
import { types } from '@polymathnetwork/new-shared';
import { TaxWithholdingsItem } from '~/pages/DividendsWizard/Step-2/shared';
import {
  ModalConfirm,
  Paragraph,
  FormItem,
  Grid,
  TextInput,
  PercentageInput,
} from '@polymathnetwork/new-ui';
import { Fragment } from 'redux-little-router';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: TaxWithholdingsItem) => void;
}

export const TaxWithholdingModal: FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const onSubmit = () => {
    // onConfirm();
  };

  return (
    <ModalConfirm
      isOpen={isOpen}
      onSubmit={onSubmit}
      onClose={onClose}
      actionButtonText="Confirm"
    >
      <ModalConfirm.Header>
        Add Tax Withholding for Specific Investor
      </ModalConfirm.Header>
      <Paragraph mb={0}>
        Specify the Investor's wallet address and its associated tax
        withholdings. The specified percentage will be withheld at the time
        dividends are paid.
      </Paragraph>
      <Grid mt="gridGap">
        <Fragment>
          <FormItem name="newTaxWithholding.investorETHAddress">
            <FormItem.Label>Investor ETH Address</FormItem.Label>
            <FormItem.Input component={TextInput} />
            <FormItem.Error />
          </FormItem>
          <FormItem name="newTaxWithholding.withholdingPercent">
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
