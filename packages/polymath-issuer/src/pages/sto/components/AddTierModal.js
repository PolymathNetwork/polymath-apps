// @flow

import React, { Component } from 'react';
import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
} from 'carbon-components-react';
import {
  Grid,
  Paragraph,
  RaisedAmount,
  TextInput,
  thousandsDelimiter,
} from '@polymathnetwork/ui';
import { Field } from 'redux-form';

class AddTierModal extends Component {
  render() {
    return (
      <ComposedModal
        open={this.props.isOpen}
        className={this.props.className}
        closeModal={this.props.onClose}
      >
        <ModalHeader title={this.props.title} />
        <ModalBody>
          <Paragraph>
            Each tier includes a fixed number of tokens and a fixed price per
            token. Provide the necessary information below to add a new
            investment tier.
          </Paragraph>
          <Grid gridAutoFlow="column" gridAutoColumns="1fr" alignItems="end">
            <Field
              name="number-of-tokens"
              component={TextInput}
              normalize={thousandsDelimiter}
              label={
                <Tooltip triggerText="Number of tokens">
                  <p className="bx--tooltip__label">Number of tokens</p>
                  <p />
                </Tooltip>
              }
              placeholder="Enter amount"
            />
            <Field
              name="token-price"
              component={TextInput}
              normalize={thousandsDelimiter}
              label="Token Price"
              placeholder="Enter amount"
            />
          </Grid>
          <Grid gridAutoFlow="column" gridAutoColumns="1fr" alignItems="end">
            <Field
              name="number-of-discounted-tokens"
              component={TextInput}
              normalize={thousandsDelimiter}
              label={
                <Tooltip triggerText="Number of tokens">
                  <p className="bx--tooltip__label">
                    maximum Number of Discounted tokens
                  </p>
                  <p />
                </Tooltip>
              }
              placeholder="Enter amount"
            />
            <Field
              name="token-price"
              component={TextInput}
              normalize={thousandsDelimiter}
              label={
                <Tooltip triggerText="Discount for Tokens Purchased with POLY">
                  <p className="bx--tooltip__label">
                    Discount for Tokens Purchased with POLY
                  </p>
                  <p />
                </Tooltip>
              }
              placeholder="0"
            />
          </Grid>
          <Grid gridAutoFlow="column" gridAutoColumns="1fr" mb={5}>
            <Grid.Item gridColumn="span 1 / 3">
              <RaisedAmount
                title="Amount Of Funds the STO Will Raise"
                primaryAmount="10000"
                tokenAmount="10000"
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
          <Button onClick={this.props.onClose}>Add new</Button>
        </ModalFooter>
      </ComposedModal>
    );
  }
}

export default AddTierModal;
