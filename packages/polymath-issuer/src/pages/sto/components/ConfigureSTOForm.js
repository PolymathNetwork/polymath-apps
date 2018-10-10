// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, getFormMeta, getFormSyncErrors } from 'redux-form';
import moment from 'moment';

import { Form, Button, Tooltip, FormGroup } from 'carbon-components-react';
import {
  TextInput,
  SelectInput,
  DatePickerInput,
  DatePickerRangeInput,
  TimePickerInput,
  TimePickerSelect,
  timeZoneName,
  thousandsDelimiter,
} from '@polymathnetwork/ui';
import {
  required,
  numeric,
  twelveHourTime,
  todayOrLater,
  dateRange,
  dateRangeTodayOrLater,
  ethereumAddress,
  gt,
} from '@polymathnetwork/ui/validate';
import { isMoment } from 'moment';

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
    // console.log(value, allValues.endDate[0])
    // console.log(moment(allValues.startDate[0]).isAfter(allValues.endDate[0]))
    if (moment(allValues.startDate[0]).isAfter(allValues.endDate[0])) {
      return 'End date must be after start date';
    }
  };

  checkStartTime = (value, allValues) => {
    console.log(value, allValues);
    console.log(moment(allValues.startDate[0] + ' ' + allValues.startTime));

    const startTime = allValues.startTime;
    const startDate = allValues.startDate;
    console.log(startTime, endTime);
    if (!startTime || !startDate) {
      return null;
    } else {
      let [hours, minutes] = startTime.timeString.split(':');
      const startDateTime = moment.add({ hours: hours, minutes: minutes });
      if (new Date().getTime() > startDateTime.getTime()) {
        return 'Time is in the past';
      }
    }
  };

  pastCheck = (value, allValues) => {
    const startTime = allValues.startTime;
    const dateRange = allValues['startDate'];
    console.log(value, allValues);
    if (!startTime || !dateRange) {
      return null;
    } else {
      let [hours, minutes] = startTime.timeString.split(':');
      if (startTime.dayPeriod === 'PM') {
        hours = parseInt(hours, 10) + 12;
      }
      const startDateTime = new Date(
        dateRange[0].getFullYear(),
        dateRange[0].getMonth(),
        dateRange[0].getDate(),
        hours,
        parseInt(minutes, 10)
      );
      console.log(startDateTime);
      if (new Date().getTime() > startDateTime.getTime()) {
        return 'Time is in the past.';
      } else if (new Date().getTime() + 600000 > startDateTime.getTime()) {
        return 'Please allow for transaction processing time.';
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
            className="bx--time-picker__select"
            placeholder="hh:mm"
            label="Time"
            validate={[twelveHourTime, this.checkStartTime]}
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
          />
        </div>

        {/* <div className="time-pickers-container">
          <Field
            name="startTime"
            component={TimePickerInput}
            label="Start Time"
            validate={[twelveHourTime, this.pastCheck]}
          />
          <Field
            name="endTime"
            component={TimePickerInput}
            label={
              <Tooltip triggerText="End Time">
                <p className="bx--tooltip__label">Start and End Times</p>
                <p>Uses your local time zone, {timeZoneName()}.</p>
              </Tooltip>
            }
            validate={[twelveHourTime]}
          />
        </div> */}
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
