// @flow
import React, { Component } from 'react';
import { Formik, Field } from 'formik';
import moment from 'moment';
import { Form, Tooltip, Button } from 'carbon-components-react';
import * as Yup from 'yup';
import {
  Box,
  Grid,
  Heading,
  RaisedAmount,
  Remark,
  thousandsDelimiter,
} from '@polymathnetwork/ui';
// import { numeric, todayOrLater, gt } from '@polymathnetwork/ui/validate';
import { todayOrLater } from '@polymathnetwork/ui/validate';
import {
  TextInput,
  DatePickerInput,
  TimePickerSelect,
} from '@polymathnetwork/ui/next';
// import { required } from '@polymathnetwork/ui/next/validations';
import InvestmentTiers from './InvestmentTiers';

// === Temp validators= === //
// const required = () => {};
// const todayOrLater = () => {};
// const afterStart = () => {};
// const secondsAfterNow = () => {};

type ComponentProps = {|
  onSubmit: () => void,
|};

function validateEndTime(value) {
  const startDate: Date = this.parent.startDate;
  const startTime: number = this.parent.startTime;
  const endDate: Date = this.parent.endDate;
  if (!startDate || !startTime || !endDate) {
    return true;
  }
  const startUnix = moment(startDate).unix() * 1000 + startTime;
  const endUnix = moment(endDate).unix() * 1000 + value;
  if (startUnix >= endUnix) {
    return this.createError({ message: 'End time is before start time.' });
  }

  return true;
}
function validateEndDate(value) {
  const startDate: Date = this.parent.startDate;
  const valid = moment(value).isAfter(startDate);
  if (!valid) {
    return this.createError({ message: 'End date must be after start date.' });
  }
  return true;
}
function todayOrAfter(value) {
  const valid = moment(value).isSameOrAfter(moment(Date.now()).startOf('day'));
  if (valid) {
    return true;
  }

  return this.createError({ message: 'Must be today or later.' });
}
function validateStartTime(value) {
  const requiredTimeBuffer = 10 * 60 * 1000;
  const startDate: Date = this.parent.startDate;

  if (!startDate) {
    return true;
  }

  const startUnix = moment(startDate).unix() * 1000 + value;
  const nowUnix = Date.now();
  const timeUntilStart = startUnix - nowUnix;

  if (nowUnix >= startUnix) {
    return this.createError({ message: 'Time is in the past.' });
  }
  if (timeUntilStart < requiredTimeBuffer) {
    return this.createError({
      message: 'Please allow for transaction processing time.',
    });
  }
  return true;
}

// TODO @RafaelVidaurre: Move reusable validators to yup singleton
const formSchema = Yup.object().shape({
  startDate: Yup.date()
    .required()
    .test('validateStartDate', todayOrAfter),
  startTime: Yup.number()
    .required()
    .test('validateStartTime', validateStartTime),
  endDate: Yup.date()
    .required()
    .test('validateEndDate', validateEndDate),
  endTime: Yup.number()
    .required()
    .test('validEndTime', validateEndTime),
});

export const USDTieredSTOFormComponent = ({ onSubmit }: ComponentProps) => {
  const initialValues = {
    tiers: [],
    cap: 0,
    amountOfFunds: 0,
    isMultipleTiers: false,
  };

  return (
    <Formik
      onSubmit={onSubmit}
      validationSchema={formSchema}
      initialValues={initialValues}
      render={({ handleSubmit, values }) => (
        <Form onSubmit={handleSubmit}>
          <Heading variant="h3">STO Schedule</Heading>
          <Box mb={4}>
            <div className="time-pickers-container">
              <Field
                name="startDate"
                component={DatePickerInput}
                label="Start Date"
                placeholder="mm / dd / yyyy"
              />
              <Field
                name="startTime"
                component={TimePickerSelect}
                className="bx--time-picker__select"
                placeholder="hh:mm"
                label="Time"
                // validate={[number().required(), validateStartTime]}
              />

              <Field
                name="endDate"
                component={DatePickerInput}
                label="End Date"
                placeholder="mm / dd / yyyy"
                // validate={[required, todayOrLater, afterStart]}
              />
              <Field
                name="endTime"
                component={TimePickerSelect}
                className="bx--time-picker__select"
                placeholder="hh:mm"
                label="Time"
                // validate={[required, afterStart]}
              />
            </div>
          </Box>
          <Heading variant="h3">STO Financing Details & Terms</Heading>
          {/* <CurrencySelect
          name="currency"
          placeholder="Raise in"
          onChange={this.handleCurrencyChange}
          onRemove={() => {}}
        /> */}

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
              // validate={[required, numeric, gt(0)]}
            />
            <Field
              name="max-investment"
              component={TextInput}
              // normalize={thousandsDelimiter}
              label={
                <Tooltip triggerText="Maximum Investment for Non-Accredited Investors by Default">
                  <p className="bx--tooltip__label">
                    Maximum Investment for Non-Accredited Investors by Default
                  </p>
                  <p>
                    Conversion rate between the currency you chose and your
                    Security Token. E.g. 1000 means that 1 ETH (or POLY) will
                    buy 1000 Security Tokens.
                  </p>
                </Tooltip>
              }
              placeholder="Enter amount"
              // validate={[required, numeric, gt(0)]}
            />
          </Grid>

          {/* <InvestmentTiers
          onChange={values => {
            // this.setState(values);
            console.log(values);
          }}
          isMultipleTiers={values.isMultipleTiers}
          tiers={values.tiers}
        /> */}

          <Grid gridAutoFlow="column" gridAutoColumns="1fr" mb={5}>
            <Grid.Item gridColumn="span 1 / 3">
              <RaisedAmount
                title="Amount Of Funds the STO Will Raise"
                primaryAmount="10000"
                tokenAmount="10000"
              />
            </Grid.Item>
          </Grid>

          <Heading variant="h3">ETH Addresses</Heading>

          <Remark title="Note">
            Before submitting to the chain, we recommend that you test sending
            funds to the wallet that is different from his own as well as
            retrieve funds from this wallet.
          </Remark>

          <Field
            name="receiver-address"
            component={TextInput}
            // normalize={thousandsDelimiter}
            label={
              <Tooltip triggerText="ETH Address to Receive the Funds Raised During the STO">
                <p className="bx--tooltip__label">
                  ETH Address to Receive the Funds Raised During the STO
                </p>
                <p />
              </Tooltip>
            }
            placeholder="Enter your current ETH address"
            onChange={() => {
              // this.handleRateChange
            }}
            // validate={[required, numeric, gt(0)]}
          />
          <Field
            name="receiver-address"
            component={TextInput}
            // normalize={thousandsDelimiter}
            label={
              <Tooltip triggerText="ETH Address for Unsold Tokens">
                <p className="bx--tooltip__label">
                  ETH Address for Unsold Tokens
                </p>
                <p />
              </Tooltip>
            }
            placeholder="Enter your current ETH address"
            // validate={[required, numeric, gt(0)]}
          />

          <Button type="submit">Confirm & launch STO</Button>
        </Form>
      )}
    />
  );
};

export default class USDTieredSTOFormContainer extends Component {
  submit = values => {
    console.log('values', values);
  };
  render() {
    return <USDTieredSTOFormComponent onSubmit={this.submit} />;
  }
}
