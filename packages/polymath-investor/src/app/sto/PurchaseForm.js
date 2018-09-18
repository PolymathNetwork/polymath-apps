// @flow

import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Button } from 'carbon-components-react';
import { TextInput } from '@polymathnetwork/ui';
import { required, integer, float } from '@polymathnetwork/ui/validate';
import type { STODetails } from '@polymathnetwork/js';

export const formName = 'purchase';

type Props = {|
  handleSubmit: () => void,
  onClose: () => void,
  change: (field: string, value: string) => void,
  details: STODetails,
|};

type State = {|
  tokens: ?number,
  cost: ?number,
|};

class PurchaseForm extends Component<Props, State> {
  state = {
    tokens: undefined,
    cost: undefined,
  };

  handleTokensChange = value => {
    let cost = '';
    if (/^[+-]?\d+(\.\d+)?$/.test(value)) {
      cost = new BigNumber(value).div(this.props.details.rate).toString(10);
    }
    this.props.change('cost', cost);
  };

  handleCostChange = value => {
    let tokens = '';
    if (/^[+-]?\d+(\.\d+)?$/.test(value)) {
      tokens = new BigNumber(value).times(this.props.details.rate).toString(10);
    }
    this.props.change('tokens', tokens);
  };

  render() {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Field
          name="tokens"
          component={TextInput}
          label="Number of Tokens to Purchase"
          placeholder="Enter the number of tokens"
          onChangeCode={this.handleTokensChange}
          value={this.state.tokens}
        />
        <Field
          name="cost"
          component={TextInput}
          label={
            'Investment in ' +
            (this.props.details.isPolyFundraise ? 'POLY' : 'ETH')
          }
          placeholder="Enter the amount"
          onChangeCode={this.handleCostChange}
          validate={[required, float]}
          value={this.state.cost}
        />
        <br />
        <p align="right">
          <Button kind="secondary" onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button type="submit" style={{ width: '154px' }}>
            Purchase
          </Button>
        </p>
        <br />
      </Form>
    );
  }
}

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  asyncValidate: async values => {
    // async validation doesn't work properly with field-level validation, so we need to specify sync rules here
    const v = values.tokens;
    const syncError = required(v) || integer(v);
    if (syncError) {
      // eslint-disable-next-line
      throw { tokens: syncError };
    }
    // TODO @bshevchenko: validation
    // let details = null
    // try {
    //   details = await TickerRegistry.getDetails(v)
    // } catch (err) {
    //   // eslint-disable-next-line no-console
    //   console.error('Error fetching details', err)
    // }
    //
    // if (details !== null) {
    //   // eslint-disable-next-line
    //   throw { ticker: 'Specified ticker is already exists.' }
    // }
  },
  asyncBlurFields: ['tokens'],
})(PurchaseForm);
