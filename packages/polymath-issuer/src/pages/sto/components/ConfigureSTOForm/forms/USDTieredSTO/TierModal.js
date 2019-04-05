// @flow

import React, { Component } from 'react';
import { get } from 'lodash';
import BigNumber from 'bignumber.js';
import {
  Grid,
  ActionModal,
  FormItem,
  Tooltip,
  NumberInput,
  Paragraph,
  RaisedAmount,
} from '@polymathnetwork/ui';

class TierModal extends Component {
  handleOnAdd = () => {
    const {
      field: { name, value },
      form: { errors, setFieldValue, setFieldTouched },
      onAdd,
      onClose,
    } = this.props;
    const isValid = !get(errors, name);
    if (isValid) {
      setFieldValue(name, null);
      onAdd(value);
      setFieldTouched(name, false);
      onClose();
    } else {
      setFieldTouched(`${name}.tokensAmount`, true);
      setFieldTouched(`${name}.tokenPrice`, true);
    }
  };

  handleOnEdit = () => {
    const {
      field: { name, value },
      form: { errors, setFieldValue, setFieldTouched },
      tierData,
      onUpdate,
      onClose,
    } = this.props;

    const isValid = !get(errors, name);

    if (isValid) {
      setFieldValue(name, null);
      onUpdate(tierData.id, value);
      setFieldTouched(name, false);
      onClose();
    } else {
      setFieldTouched(`${name}.tokensAmount`, true);
      setFieldTouched(`${name}.tokenPrice`, true);
    }
  };

  componentDidUpdate(prevProps) {
    const {
      field: { name },
      form: { setFieldValue, setFieldTouched },
      tierData,
    } = this.props;
    /**
     * NOTE @monitz87: If opening the modal, we repopulate the newTier
     * object to have intial values in the modal form for validation.
     */
    if (!prevProps.isOpen && this.props.isOpen) {
      // NOTE @RafaelVidaurre: Hack to fix bug with Formik not recreating the
      // errors object for this field
      setFieldTouched(name, false);
      if (tierData) {
        setFieldValue(name, {
          tokensAmount: tierData.tokensAmount,
          tokenPrice: tierData.tokenPrice,
        });
      } else {
        setFieldValue(name, { tokensAmount: null, tokenPrice: null });
      }
    }
  }

  render() {
    const {
      field: { name, value },
      form: { values },
      ticker,
      isOpen,
      onClose,
      tierData,
    } = this.props;
    const thisTier = value || {};
    const tokenPrice = thisTier.tokenPrice || new BigNumber(0);
    const tokensAmount = thisTier.tokensAmount || new BigNumber(0);
    const tierNum = tierData
      ? tierData.id + 1
      : values.investmentTiers.tiers.length + 1;
    const tierTokensAmount = tokensAmount || new BigNumber(0);
    const tierUsdAmount = tokenPrice.times(tierTokensAmount);

    return (
      <ActionModal
        isOpen={isOpen}
        onClose={onClose}
        actionButtonText={tierData ? `Save` : `Add new`}
        onSubmit={tierData ? this.handleOnEdit : this.handleOnAdd}
        maxWidth={740}
      >
        <ActionModal.Header>
          {tierData
            ? `Edit Investment Tier`
            : `Add the Investment Tier #${tierNum}`}
        </ActionModal.Header>
        <ActionModal.Body>
          <Paragraph>
            Each tier includes a fixed number of tokens and a fixed price per
            token. Provide the necessary information below to add a new
            investment tier.
          </Paragraph>
          <Grid gridAutoFlow="column" gridAutoColumns="1fr">
            <FormItem name={`${name}.tokensAmount`}>
              <FormItem.Label>
                <Tooltip triggerText="Number of tokens">
                  <p>
                    <strong>Number of tokens</strong>
                  </p>
                  <p>
                    Number of tokens to be sold in this tier. All tokens in the
                    tier will carry the same price and need to be sold for the
                    STO to move to the next tier (if multiple tiers are
                    defined).
                  </p>
                </Tooltip>
              </FormItem.Label>
              <FormItem.Input
                component={NumberInput}
                placeholder="Enter amount"
                useBigNumbers
              />
              <FormItem.Error />
            </FormItem>
            <FormItem name={`${name}.tokenPrice`}>
              <FormItem.Label>Token Price</FormItem.Label>
              <FormItem.Input
                component={NumberInput}
                placeholder="Enter amount"
                maxDecimals={2}
                unit="USD"
                useBigNumbers
              />
              <FormItem.Error />
            </FormItem>
          </Grid>
          <Grid gridAutoFlow="column" gridAutoColumns="1fr" mb={5}>
            <Grid.Item gridColumn="span 1 / 3">
              <RaisedAmount
                title={`Amount Of Funds the tier ${tierNum} STO Will Raise`}
                primaryAmount={tierUsdAmount}
                primaryUnit="USD"
                tokenAmount={tierTokensAmount}
                tokenUnit={ticker.toUpperCase()}
              />
            </Grid.Item>
          </Grid>
        </ActionModal.Body>
      </ActionModal>
    );
  }
}
export default TierModal;
