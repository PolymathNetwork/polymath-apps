// @flow

import React, { Component } from 'react';
import { get } from 'lodash';
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
  thousandsDelimiter,
} from '@polymathnetwork/ui';
import { NumberInput } from '@polymathnetwork/ui/next';
import { Field } from 'formik';

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
      field: { name },
    } = this.props;
    return (
      <ComposedModal open={this.props.isOpen} className={this.props.className}>
        <ModalHeader title={this.props.title} closeModal={this.props.onClose} />
        <ModalBody>
          <Paragraph>
            Each tier includes a fixed number of tokens and a fixed price per
            token. Provide the necessary information below to add a new
            investment tier.
          </Paragraph>
          <Grid gridAutoFlow="column" gridAutoColumns="1fr" alignItems="end">
            <Field
              name={`${name}.tokensAmount`}
              component={NumberInput}
              label={
                <Tooltip triggerText="Number of tokens">
                  <p className="bx--tooltip__label">Number of tokens</p>
                  <p />
                </Tooltip>
              }
              placeholder="Enter amount"
            />
            <Field
              name={`${name}.tokenPrice`}
              component={NumberInput}
              label="Token Price"
              placeholder="Enter amount"
            />
          </Grid>
          <Grid gridAutoFlow="column" gridAutoColumns="1fr" alignItems="end">
            <Field
              name={`${name}.discountedTokensAmount`}
              component={NumberInput}
              label={
                <Tooltip triggerText="Number of tokens">
                  <p className="bx--tooltip__label">
                    Maximum Number of Discounted tokens
                  </p>
                  <p />
                </Tooltip>
              }
              placeholder="Enter amount"
            />
            <Field
              name={`${name}.discountedTokensPrice`}
              component={NumberInput}
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
          <Button onClick={this.handleOnAdd}>Add new</Button>
        </ModalFooter>
      </ComposedModal>
    );
  }
}

export default AddTierModal;
