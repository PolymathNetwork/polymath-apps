// @flow

import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import moment from 'moment';
import { Form, Tooltip } from 'carbon-components-react';
import {
  Grid,
  CurrencySelect,
  TextInput,
  DatePickerInput,
  TimePickerSelect,
  Remark,
  thousandsDelimiter,
} from '@polymathnetwork/ui';
import {
  required,
  numeric,
  todayOrLater,
  gt,
} from '@polymathnetwork/ui/validate';

import InvestmentTiers from './InvestmentTiers';

export const formName = 'peg_to_fiat_sto';

type Props = {
  handleSubmit: () => void,
};

const gt0 = gt(0);

type State = {|
  currency: string,
  cap: number,
  rate: number,
  amountOfFunds: string,
|};

class PegToFiatSTOForm extends Component<Props, State> {
  state = {
    cap: 0,
    rate: 0,
    amountOfFunds: '0',
    isMultipleTiers: false,
    tiers: [],
  };

  handleCurrencyChange = (event: Object, newValue: string) => {
    this.setState({ currency: newValue });
  };

  handleCapChange = (event: Object, newValue: string) => {
    this.setState({ cap: Number(newValue.replace(/,/g, '')) });
    this.updateAmountOfFunds(
      Number(newValue.replace(/,/g, '')) / this.state.rate
    );
  };

  handleRateChange = (event: Object, newValue: string) => {
    this.setState({ rate: Number(newValue.replace(/,/g, '')) });
    this.updateAmountOfFunds(
      this.state.cap / Number(newValue.replace(/,/g, ''))
    );
  };

  checkStartAfterEnd = (value, allValues) => {
    if (!allValues.startDate) {
      return null;
    } else if (moment(allValues.startDate[0]).isAfter(allValues.endDate[0])) {
      return 'End date must be after start date';
    } else {
      return null;
    }
  };

  checkStartTime = (value, allValues) => {
    const startTime = allValues.startTime;
    const startDate = new Date(allValues.startDate);

    if (!startTime || !startDate) {
      return null;
    } else {
      let [hours, minutes] = startTime.split(':');
      const startDateTime = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        hours,
        parseInt(minutes, 10)
      );
      if (new Date().getTime() > startDateTime.getTime()) {
        return 'Time is in the past.';
      } else if (new Date().getTime() + 600000 > startDateTime.getTime()) {
        return 'Please allow for transaction processing time.';
      }
    }
  };

  checkEndTime = (value, allValues) => {
    const startTime = allValues.startTime;
    const startDate = new Date(allValues.startDate);
    const endTime = allValues.endTime;
    const endDate = new Date(allValues.endDate);

    if (!startTime || !startDate || !endTime || !endDate) {
      return null;
    } else {
      let [starthours, startminutes] = startTime.split(':');
      const startDateTime = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        starthours,
        parseInt(startminutes, 10)
      );

      let [endhours, endminutes] = endTime.split(':');
      const endDateTime = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        endhours,
        parseInt(endminutes, 10)
      );
      if (startDateTime.getTime() > endDateTime.getTime()) {
        return 'End time is before start time';
      }
    }
  };

  updateAmountOfFunds = (value: number) => {
    this.setState({
      amountOfFunds:
        isNaN(value) || value === Infinity ? '0' : thousandsDelimiter(value),
    });
  };

  render() {
    const { isMultipleTiers, tiers } = this.state;

    return (
      <Form onSubmit={this.props.handleSubmit}>
        <h3 className="pui-h3">STO Schedule</h3>
        <div className="time-pickers-container">
          <Field
            name="startDate"
            component={DatePickerInput}
            label="Start Date"
            placeholder="mm / dd / yyyy"
            validate={[required, todayOrLater]}
          />
          <Field
            name="startTime"
            step={30}
            component={TimePickerSelect}
            className="bx--time-picker__select"
            placeholder="hh:mm"
            label="Time"
            validate={[required, this.checkStartTime]}
          />

          <Field
            name="endDate"
            component={DatePickerInput}
            label="End Date"
            placeholder="mm / dd / yyyy"
            validate={[required, todayOrLater, this.checkStartAfterEnd]}
          />
          <Field
            name="endTime"
            step={30}
            component={TimePickerSelect}
            className="bx--time-picker__select"
            placeholder="hh:mm"
            label="Time"
            validate={[required, this.checkEndTime]}
          />
        </div>

        <h3 className="pui-h3">STO Financing Details & Terms</h3>
        <CurrencySelect
          name="currency"
          placeholder="Raise in"
          onChange={this.handleCurrencyChange}
          onRemove={() => {}}
        />

        <Grid gridAutoFlow="column" gridAutoColumns="1fr" alignItems="end">
          <Field
            name="cap"
            component={TextInput}
            normalize={thousandsDelimiter}
            label={
              <Tooltip triggerText="Minimum investment for All investors">
                <p className="bx--tooltip__label">
                  Minimum investment for All investors
                </p>
                <p>
                  Hard Cap is the maximum number of tokens available through
                  this offering. e.g. if you want the total aggregate of your
                  investors in this offering to own 10 million tokens, enter
                  10000000.
                </p>
              </Tooltip>
            }
            placeholder="Enter amount"
            onChange={this.handleCapChange}
            validate={[required, numeric, gt0]}
          />
          <Field
            name="max-investment"
            component={TextInput}
            normalize={thousandsDelimiter}
            label={
              <Tooltip triggerText="Maximum Investment for Non-Accredited Investors by Default">
                <p className="bx--tooltip__label">
                  Maximum Investment for Non-Accredited Investors by Default
                </p>
                <p>
                  Conversion rate between the currency you chose and your
                  Security Token. E.g. 1000 means that 1 ETH (or POLY) will buy
                  1000 Security Tokens.
                </p>
              </Tooltip>
            }
            placeholder="Enter amount"
            onChange={this.handleRateChange}
            validate={[required, numeric, gt0]}
          />
        </Grid>

        <InvestmentTiers
          onChange={values => {
            console.log(values);
          }}
          isMultipleTiers={isMultipleTiers}
          tiers={tiers}
        />

        <h3>ETH Addresses</h3>

        <Remark title="Note">
          Before submitting to the chain, we recommend that you test sending
          funds to the wallet that is different from his own as well as retrieve
          funds from this wallet.
        </Remark>

        <Field
          name="receiver-address"
          component={TextInput}
          normalize={thousandsDelimiter}
          label={
            <Tooltip triggerText="ETH Address to Receive the Funds Raised During the STO">
              <p className="bx--tooltip__label">
                ETH Address to Receive the Funds Raised During the STO
              </p>
              <p />
            </Tooltip>
          }
          placeholder="Enter your current ETH address"
          onChange={this.handleRateChange}
          validate={[required, numeric, gt0]}
        />
        <Field
          name="receiver-address"
          component={TextInput}
          normalize={thousandsDelimiter}
          label={
            <Tooltip triggerText="ETH Address for Unsold Tokens">
              <p className="bx--tooltip__label">
                ETH Address for Unsold Tokens
              </p>
              <p />
            </Tooltip>
          }
          placeholder="Enter your current ETH address"
          onChange={this.handleRateChange}
          validate={[required, numeric, gt0]}
        />
      </Form>
    );
  }
}

export default reduxForm({
  form: formName,
})(PegToFiatSTOForm);
