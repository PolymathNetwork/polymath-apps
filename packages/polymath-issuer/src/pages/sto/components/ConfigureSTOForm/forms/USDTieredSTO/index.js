// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { map, keys } from 'lodash';
import { Formik, Field, ErrorMessage } from 'formik';
import moment from 'moment';
import { Form, Tooltip, Button } from 'carbon-components-react';
import * as Yup from 'yup';
import { Box, Grid, Heading, RaisedAmount, Remark } from '@polymathnetwork/ui';
import {
  TextInput,
  DatePickerInput,
  TimePickerSelect,
  NumberInput,
  CurrencySelect,
} from '@polymathnetwork/ui/next';
import InputError from '@polymathnetwork/ui/components/InputError';
import InvestmentTiers from './InvestmentTiers';
import { toWei } from '../../../../../../utils/contracts';
import { FUND_RAISE_TYPES } from '../../../../../../constants';
import { configureSTO } from '../../../../../../actions/sto';

import type { FundRaiseType } from '../../../../../../constants';
import type { Dispatch } from 'redux';

type ComponentProps = {|
  onSubmit: (values: FormValues) => void,
|};

type ContainerProps = {|
  dispatch: Dispatch<any>,
  address: string,
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

const requiredMessage = 'Required.';
/* eslint-disable no-template-curly-in-string */
const moreThanMessage = 'Must be larger than ${more}.';
const minMessage = 'Must be at least ${min}.';
/* eslint-enable no-template-curly-in-string */

/**
 * NOTE @monitz87: typeError is needed here because of some
 * strange behavior by the yup library, which simply ignores
 * the required constraint in favor of the field type for these fields.
 * I suspect it has something to do with them being inside an array schema
 */
export const investmentTierSchema = Yup.object().shape({
  tokensAmount: Yup.number()
    .typeError(requiredMessage)
    .required(requiredMessage)
    .moreThan(0, moreThanMessage),
  tokenPrice: Yup.number()
    .typeError(requiredMessage)
    .required(requiredMessage)
    .moreThan(0, moreThanMessage),
  discountedTokensAmount: Yup.number()
    .typeError(requiredMessage)
    .required(requiredMessage)
    .min(0, minMessage),
  discountedTokensPrice: Yup.number()
    .typeError(requiredMessage)
    .required(requiredMessage)
    .min(0, minMessage),
});

// TODO @RafaelVidaurre: Move reusable validators to yup singleton
const formSchema = Yup.object().shape({
  startDate: Yup.date()
    .required(requiredMessage)
    .test('validateStartDate', todayOrAfter),
  startTime: Yup.number()
    .required(requiredMessage)
    .test('validateStartTime', validateStartTime),
  endDate: Yup.date()
    .required(requiredMessage)
    .test('validateEndDate', validateEndDate),
  endTime: Yup.number()
    .required(requiredMessage)
    .test('validEndTime', validateEndTime),
  currencies: Yup.array()
    .of(Yup.string())
    .required(requiredMessage),
  nonAccreditedMax: Yup.number()
    .required(requiredMessage)
    .min(0, minMessage),
  minimumInvestment: Yup.number()
    .required(requiredMessage)
    .min(0, minMessage),
  receiverAddress: Yup.string().required(requiredMessage),
  unsoldTokensAddress: Yup.string().required(requiredMessage),
  investmentTiers: Yup.object().shape({
    isMultipleTiers: Yup.boolean(),
    tiers: Yup.array().of(investmentTierSchema),
    newTier: investmentTierSchema.nullable(),
  }),
});

// FIXME @RafaelVidaurre: RESET to empty values, these are hardcoded for testing
// TODO @RafaelVidaurre: Improve fields naming

const initialValues = {
  startDate: new Date(Date.now() + 1000 * 360 * 24),
  endDate: new Date(Date.now() + 1000 * 360 * 24 * 10),
  startTime: 0,
  endTime: 0,
  investmentTiers: {
    isMultipleTiers: false,
    tiers: [
      {
        tokensAmount: '',
        tokenPrice: '',
        discountedTokensAmount: '',
        discountedTokensPrice: 0,
      },
    ],
    newtier: null,
  },
  nonAccreditedMax: 0,
  minimumInvestment: 0,
  receiverAddress: '0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e',
  unsoldTokensAddress: '0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e',
  currencies: ['ETH', 'POLY'],
};

export const USDTieredSTOFormComponent = ({ onSubmit }: ComponentProps) => {
  return (
    <Formik
      onSubmit={onSubmit}
      validationSchema={formSchema}
      initialValues={initialValues}
      render={({ handleSubmit, values, errors, touched }) => {
        console.log('values', values);
        return (
          <Form onSubmit={handleSubmit}>
            <Heading variant="h3">STO Schedule</Heading>
            <Box mb={4}>
              <div className="time-pickers-container">
                <div>
                  <Field
                    name="startDate"
                    component={DatePickerInput}
                    label="Start Date"
                    placeholder="mm / dd / yyyy"
                  />
                  <ErrorMessage component={InputError} name="startDate" />
                </div>
                <div>
                  <Field
                    name="startTime"
                    component={TimePickerSelect}
                    className="bx--time-picker__select"
                    placeholder="hh:mm"
                    label="Time"
                  />
                  <ErrorMessage component={InputError} name="startTime" />
                </div>
                <div>
                  <Field
                    name="endDate"
                    component={DatePickerInput}
                    label="End Date"
                    placeholder="mm / dd / yyyy"
                  />
                  <ErrorMessage component={InputError} name="endDate" />
                </div>
                <div>
                  <Field
                    name="endTime"
                    component={TimePickerSelect}
                    className="bx--time-picker__select"
                    placeholder="hh:mm"
                    label="Time"
                  />
                  <ErrorMessage component={InputError} name="endTime" />
                </div>
              </div>
            </Box>
            <Heading variant="h3">STO Financing Details & Terms</Heading>
            <div>
              <Field
                component={CurrencySelect}
                name="currencies"
                placeholder="Raise in"
              />
              <ErrorMessage component={InputError} name="currencies" />
            </div>

            <Grid gridAutoFlow="column" gridAutoColumns="1fr" alignItems="end">
              <div>
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
                  unit="USD"
                />
                <ErrorMessage component={InputError} name="minimumInvestment" />
              </div>
              <div>
                <Field
                  name="nonAccreditedMax"
                  component={NumberInput}
                  label={
                    <Tooltip triggerText="Maximum Investment for Non-Accredited Investors by Default">
                      <p className="bx--tooltip__label">
                        Maximum Investment for Non-Accredited Investors by
                        Default
                      </p>
                      <p>
                        Conversion rate between the currency you chose and your
                        Security Token. E.g. 1000 means that 1 ETH (or POLY)
                        will buy 1000 Security Tokens.
                      </p>
                    </Tooltip>
                  }
                  placeholder="Enter amount"
                  unit="USD"
                />
                <ErrorMessage component={InputError} name="nonAccreditedMax" />
              </div>
            </Grid>

            <div>
              <Field name="investmentTiers" component={InvestmentTiers} />
            </div>

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

            <div>
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
              <ErrorMessage component={InputError} name="receiverAddress" />
            </div>

            <div>
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
              <ErrorMessage component={InputError} name="unsoldTokensAddress" />
            </div>
            <Button type="submit">Confirm & launch STO</Button>
          </Form>
        );
      }}
    />
  );
};

// TODO @RafaelVidaurre: Move to new file
const mapStateToProps = ({
  sto: {
    factory: { address },
  },
}) => ({ address });

type InvestmentTier = {|
  tokensAmount: number,
  tokenPrice: number,
  discountedTokensAmount: number,
  discountedTokensPrice: number,
|};
type FormValues = {|
  startDate: Date,
  startTime: number,
  endDate: Date,
  endTime: number,
  investmentTiers: {
    tiers: Array<InvestmentTier>,
  },
  nonAccreditedMax: number,
  minimumInvestment: number,
  currencies: FundRaiseType,
  receiverAddress: string,
  unsoldTokensAddress: string,
|};

class USDTieredSTOFormContainer extends Component<ContainerProps> {
  submit = (values: FormValues) => {
    const { dispatch, address } = this.props;

    const formattedValues = {
      startsAt: new Date(
        new Date(values.startDate).getTime() + values.startTime
      ),
      endsAt: new Date(new Date(values.endDate).getTime() + values.endTime),
      ratePerTier: map(values.investmentTiers.tiers, 'tokenPrice'),
      discountRatePerTier: map(
        values.investmentTiers.tiers,
        'discountedTokensPrice'
      ),
      tokensPerTier: map(values.investmentTiers.tiers, ({ tokensAmount }) =>
        toWei(tokensAmount)
      ),
      discountTokensPerTier: map(
        values.investmentTiers.tiers,
        ({ discountedTokensAmount }) => toWei(discountedTokensAmount)
      ),
      nonAccreditedLimit: values.nonAccreditedMax,
      minimumInvestment: values.minimumInvestment,
      currencies: map(
        values.currencies,
        currency => FUND_RAISE_TYPES[currency]
      ),
      receiverAddress: values.receiverAddress,
      unsoldTokensAddress: values.unsoldTokensAddress,
    };
    console.log('formattedValues', formattedValues);

    const config = {
      data: formattedValues,
    };

    dispatch(configureSTO(address, config)).catch(error => {
      throw error;
    });
  };
  render() {
    return <USDTieredSTOFormComponent onSubmit={this.submit} />;
  }
}

export default connect(mapStateToProps)(USDTieredSTOFormContainer);
