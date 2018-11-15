// @flow

import React, { Component } from 'react';
import { get } from 'lodash';
import { Field } from 'formik';
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
} from 'carbon-components-react';
import BigNumber from 'bignumber.js';
import {
  Grid,
  Box,
  Modal,
  FormItem,
  NumberInput,
  PercentageInput,
  Paragraph,
  RaisedAmount,
} from '@polymathnetwork/ui';

class AddTierModal extends Component {
  handleOnAdd = () => {
    const {
      field,
      form: { errors, setFieldValue, setFieldTouched },
    } = this.props;
    const isValid = !get(errors, field.name);

    if (isValid) {
      setFieldValue(field.name, null);
      this.props.onAdd(field.value);
      setFieldTouched(field.name, false);
      this.props.onClose();
    }
  };
  render() {
    const {
      field: { name, value },
      form: { values },
      ticker,
    } = this.props;

    let disabled = false;

    if (!value) {
      disabled = true;
    }
    const thisTier = value || {};
    const tokenPrice = thisTier.tokenPrice || new BigNumber(0);
    const tokensAmount = thisTier.tokensAmount || new BigNumber(0);

    const tierNum = values.investmentTiers.tiers.length + 1;
    const tierTokensAmount = tokensAmount || 0;
    const tierUsdAmount = tokenPrice * tierTokensAmount;

    return (
      <Modal isOpen={this.props.isOpen} onClose={this.props.onClose}>
        <ModalHeader title={this.props.title} closeModal={this.props.onClose} />
        <ModalBody>
          <Paragraph>
            Each tier includes a fixed number of tokens and a fixed price per
            token. Provide the necessary information below to add a new
            investment tier.
          </Paragraph>
          <Grid gridAutoFlow="column" gridAutoColumns="1fr">
            <FormItem name={`${name}.tokensAmount`}>
              <FormItem.Label>
                <Tooltip triggerText="Number of tokens">
                  <p className="bx--tooltip__label">Number of tokens</p>
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
                unit="USD"
                useBigNumbers
              />
              <FormItem.Error />
            </FormItem>
          </Grid>
          <Grid gridAutoFlow="column" gridAutoColumns="1fr">
            <FormItem name={`${name}.discountedTokensAmount`}>
              <FormItem.Label>
                <Tooltip triggerText="Maximum Number of discounted tokens">
                  <p className="bx--tooltip__label">
                    Maximum Number of discounted tokens
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
            <Box maxWidth="5em">
              <FormItem name={`${name}.discountedTokensRate`}>
                <FormItem.Label>
                  <Tooltip triggerText="Discount for Tokens Purchased with POLY">
                    <p className="bx--tooltip__label">
                      Discount for Tokens Purchased with POLY
                    </p>
                  </Tooltip>
                </FormItem.Label>
                <FormItem.Input
                  FormikComponent={Field}
                  component={PercentageInput}
                  placeholder="Enter percentage"
                  unit="%"
                />
                <FormItem.Error />
              </FormItem>
            </Box>
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
        </ModalBody>

        <ModalFooter>
          <Button
            className="cancel-btn"
            kind="secondary"
            onClick={this.props.onClose}
          >
            Cancel
          </Button>
          <Button disabled={disabled} onClick={this.handleOnAdd}>
            Add new
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default AddTierModal;
