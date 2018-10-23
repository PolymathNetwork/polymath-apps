// @flow

import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import moment from 'moment';

import { Form, Button, Tooltip, FormGroup } from 'carbon-components-react';
import {
  TextInput,
  SelectInput,
  DatePickerInput,
  TimePickerSelect,
  thousandsDelimiter,
} from '@polymathnetwork/ui';
import {
  required,
  numeric,
  todayOrLater,
  ethereumAddress,
  gt,
} from '@polymathnetwork/ui/validate';

export const formName = 'configure_sto';

type Props = {
  handleSubmit: () => void,
};

const defaultCurrency = 'POLY';

const gt0 = gt(0);

type State = {|
  currency: string,
  cap: number,
  rate: number,
  amountOfFunds: string,
|};

class ConfigureSTOForm extends Component<Props, State> {
  state = {
    currency: defaultCurrency,
    cap: 0,
    rate: 0,
    amountOfFunds: '0',
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
      return 'Selected end date/time is before the start date/time - Please update the dates accordingly';
    } else {
      return null;
    }
  };

  convertAMPMTime = (time, date) => {
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM === 'PM' && hours < 12) hours = hours + 12;
    if (AMPM === 'AM' && hours === 12) hours = hours - 12;

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      parseInt(minutes, 10)
    );
  };

  checkStartTime = (value, allValues) => {
    const startTime = allValues.startTime;
    const startDate = new Date(allValues.startDate);

    if (!startTime || !startDate) {
      return null;
    } else {
      const startDateTime = this.convertAMPMTime(startTime, startDate);

      if (new Date().getTime() > startDateTime.getTime()) {
        return 'Time is in the past.';
      } else if (new Date().getTime() + 600000 > startDateTime.getTime()) {
        return 'Selected time is too close to current time.';
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
      const startDateTime = this.convertAMPMTime(startTime, startDate);
      const endDateTime = this.convertAMPMTime(endTime, endDate);

      if (startDateTime.getTime() > endDateTime.getTime()) {
        return 'Selected end date/time is before the start date/time - Please update the dates accordingly';
      } else if (startDateTime.getTime() + 600000 > endDateTime.getTime()) {
        return 'Start time is too close to the end time.';
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
    return (
      <Form onSubmit={this.props.handleSubmit}>
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
            hideLabel={false}
            className="bx--time-picker__select"
            placeholder="hh:mm"
            label="Start Time"
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
            label="End Time"
            validate={[required, this.checkEndTime]}
          />
        </div>

        <Field
          name="currency"
          component={SelectInput}
          label="Raise in"
          placeholder="Choose a currency"
          options={[
            { value: 'ETH', label: 'ETH' },
            { value: 'POLY', label: 'POLY' },
          ]}
          onChange={this.handleCurrencyChange}
          defaultValue={defaultCurrency}
        />
        <Field
          name="cap"
          component={TextInput}
          normalize={thousandsDelimiter}
          label={
            <Tooltip triggerText="Hard Cap (in Tokens)">
              <p className="bx--tooltip__label">Hard Cap (in Tokens)</p>
              <p>
                Hard Cap is the maximum number of tokens available through this
                offering. e.g. if you want the total aggregate of your investors
                in this offering to own 10 million tokens, enter 10000000.
              </p>
            </Tooltip>
          }
          placeholder="Enter amount"
          onChange={this.handleCapChange}
          validate={[required, numeric, gt0]}
        />
        <Field
          name="rate"
          component={TextInput}
          normalize={thousandsDelimiter}
          label={
            <Tooltip triggerText="Rate">
              <p className="bx--tooltip__label">Rate</p>
              <p>
                Conversion rate between the currency you chose and your Security
                Token. E.g. 1000 means that 1 ETH (or POLY) will buy 1000
                Security Tokens.
              </p>
            </Tooltip>
          }
          placeholder="Enter amount"
          onChange={this.handleRateChange}
          validate={[required, numeric, gt0]}
        />
        <Field
          name="fundsReceiver"
          component={TextInput}
          label={
            <Tooltip triggerText="ETH Address to receive the funds raised during the STO">
              <p className="bx--tooltip__label">Fund Receiver Address</p>
              <p>
                The ethereum address that will receive the funds raised through
                the STO.
              </p>
            </Tooltip>
          }
          placeholder="Enter address"
          validate={[required, ethereumAddress]}
        />
        <FormGroup
          legendText="Amount Of Funds The STO Will Raise"
          style={{ marginTop: '20px', fontSize: '14px' }}
        >
          {this.state.amountOfFunds} {this.state.currency}
        </FormGroup>
        <Button type="submit">DEPLOY AND SCHEDULE STO</Button>
        <p className="pui-input-hint">
          When you launch your security token offering, only whitelisted
          investors will be able to participate. Please make sure to add to the
          whitelist the ETH addresses deemed suitable by your KYC/AML provider.
        </p>
      </Form>
    );
  }
}

export default reduxForm({
  form: formName,
})(ConfigureSTOForm);
