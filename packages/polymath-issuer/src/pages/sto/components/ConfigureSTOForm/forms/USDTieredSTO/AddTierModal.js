// @flow

import React, { Component } from 'react';
import { get } from 'lodash';
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
} from 'carbon-components-react';
import {
  Grid,
  Box,
  Modal,
  Paragraph,
  RaisedAmount,
  thousandsDelimiter,
} from '@polymathnetwork/ui';
import InputError from '@polymathnetwork/ui/components/InputError';
import { NumberInput } from '@polymathnetwork/ui/next';
import { Field, ErrorMessage } from 'formik';

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
      <Modal isOpen={this.props.isOpen} onClose={this.props.onClose}>
        <ModalHeader title={this.props.title} closeModal={this.props.onClose} />
        <ModalBody>
          <Paragraph>
            Each tier includes a fixed number of tokens and a fixed price per
            token. Provide the necessary information below to add a new
            investment tier.
          </Paragraph>
          <Grid gridAutoFlow="column" gridAutoColumns="1fr" alignItems="end">
            <div>
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
              <ErrorMessage
                component={InputError}
                name={`${name}.tokensAmount`}
              />
            </div>
            <div>
              <Field
                name={`${name}.tokenPrice`}
                component={NumberInput}
                label="Token Price"
                placeholder="Enter amount"
                unit="USD"
              />
              <ErrorMessage
                component={InputError}
                name={`${name}.tokenPrice`}
              />
            </div>
          </Grid>
          <Grid gridAutoFlow="column" gridAutoColumns="1fr" alignItems="end">
            <div>
              <Field
                name={`${name}.discountedTokensAmount`}
                component={NumberInput}
                label={
                  <Tooltip triggerText="Number of discounted tokens">
                    <p className="bx--tooltip__label">
                      Maximum Number of Discounted tokens
                    </p>
                    <p />
                  </Tooltip>
                }
                placeholder="Enter amount"
              />
              <ErrorMessage
                component={InputError}
                name={`${name}.discountedTokensAmount`}
              />
            </div>
            <Box maxWidth="5em">
              <div>
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
                  unit="USD"
                />
                <ErrorMessage
                  component={InputError}
                  name={`${name}.discountedTokensPrice`}
                />
              </div>
            </Box>
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
      </Modal>
    );
  }
}

export default AddTierModal;
