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
import {
  TextInput,
  DatePickerInput,
  TimePickerSelect,
  NumberInput,
  CurrencySelect,
} from '@polymathnetwork/ui/next';
import InvestmentTiers from './InvestmentTiers';

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
export const investmentTierSchema = Yup.object().shape({
  tokensAmount: Yup.number().required(),
  tokenPrice: Yup.number()
    .required()
    .moreThan(0),
  discountedTokensAmount: Yup.number()
    .required()
    .min(0),
  discountedTokensPrice: Yup.number()
    .required()
    .min(0),
});

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
  currencies: Yup.array()
    .required()
    .min(1),
  nonAccreditedMax: Yup.number()
    .required()
    .moreThan(0),
  receiverAddress: Yup.string().required(),
  unsoldTokensAddress: Yup.string().required(),
  investmentTiers: Yup.object().shape({
    isMultipleTiers: Yup.boolean(),
    tiers: Yup.array().of(investmentTierSchema),
    newTier: investmentTierSchema.nullable(),
  }),
});

export const USDTieredSTOFormComponent = ({ onSubmit }: ComponentProps) => {
  const initialValues = {
    investmentTiers: {
      tiers: [],
      isMultipleTiers: false,
      newTier: null,
    },
    currencies: ['ETH', 'POLY'],
  };

  return (
    <Formik
      onSubmit={onSubmit}
      validationSchema={formSchema}
      initialValues={initialValues}
      validateOnBlur={true}
      validateOnChange={false}
      render={({ handleSubmit, values, errors, setFieldValue }) => {
        return (
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
                />
                <Field
                  name="endDate"
                  component={DatePickerInput}
                  label="End Date"
                  placeholder="mm / dd / yyyy"
                />
                <Field
                  name="endTime"
                  component={TimePickerSelect}
                  className="bx--time-picker__select"
                  placeholder="hh:mm"
                  label="Time"
                />
              </div>
            </Box>
            <Heading variant="h3">STO Financing Details & Terms</Heading>
            <Field
              component={CurrencySelect}
              name="currencies"
              placeholder="Raise in"
              onRemove={() => {}}
            />

            <Grid gridAutoFlow="column" gridAutoColumns="1fr" alignItems="end">
              <Field
                name="minimumInvestment"
                component={NumberInput}
                min={0}
                label={
                  <Tooltip triggerText="Minimum investment for All investors">
                    <p className="bx--tooltip__label">
                      Minimum investment for All investors
                    </p>
                  </Tooltip>
                }
                placeholder="Enter amount"
              />
              <Field
                name="nonAccreditedMax"
                min={0}
                component={NumberInput}
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
              />
            </Grid>

            <Field name="investmentTiers" component={InvestmentTiers} />

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
              name="receiverAddress"
              component={TextInput}
              label={
                <Tooltip triggerText="ETH Address to Receive the Funds Raised During the STO">
                  <p className="bx--tooltip__label">
                    ETH Address to Receive the Funds Raised During the STO
                  </p>
                  <p />
                </Tooltip>
              }
              placeholder="Enter your current ETH address"
            />
            <Field
              name="unsoldTokensAddress"
              component={TextInput}
              label={
                <Tooltip triggerText="ETH Address for Unsold Tokens">
                  <p className="bx--tooltip__label">
                    ETH Address for Unsold Tokens
                  </p>
                  <p />
                </Tooltip>
              }
              placeholder="Enter your current ETH address"
            />

            <Button type="submit">Confirm & launch STO</Button>
          </Form>
        );
      }}
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
