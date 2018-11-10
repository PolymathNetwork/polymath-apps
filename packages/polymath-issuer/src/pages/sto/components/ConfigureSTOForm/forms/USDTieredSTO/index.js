// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isNumber, map, reduce } from 'lodash';
import { FastField, withFormik } from 'formik';
import moment from 'moment-timezone';
import { Form, Tooltip, Button } from 'carbon-components-react';
import * as Yup from 'yup';
import Web3 from 'web3';
import {
  Box,
  Grid,
  FormItem,
  Heading,
  RaisedAmount,
  Remark,
  TextInput,
  DatePickerInput,
  TimePickerSelect,
  NumberInput,
  CurrencySelect,
} from '@polymathnetwork/ui';
import InvestmentTiers from './InvestmentTiers';
import { toWei } from '../../../../../../utils/contracts';
import { FUND_RAISE_TYPES } from '../../../../../../constants';
import { configureSTO } from '../../../../../../actions/sto';

import type { Dispatch } from 'redux';
import type { RootState } from '../../../../../../redux/reducer';
import type { FundRaiseType } from '../../../../../../constants';

const TRANSACTION_TIME_BUFFER = 20 * 60 * 1000;

type FormikProps = {|
  handleSubmit: () => void,
  values: FormValues,
  touched: { [name: string]: boolean },
  errors: { [name: string]: string },
|};
type ComponentProps = {|
  ticker: string,
  ...FormikProps,
|};
type ContainerProps = {|
  dispatch: Dispatch<any>,
  address: string,
  ticker: string,
  ...FormikProps,
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
  const valid = moment(value).isSameOrAfter(startDate);
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
  const startDate: Date = this.parent.startDate;

  if (!startDate) {
    return true;
  }

  const startUnix = moment(startDate).unix() * 1000 + value;
  const nowUnix = moment(Date.now()).unix() * 1000;
  const timeUntilStart = startUnix - nowUnix;

  if (nowUnix >= startUnix) {
    return this.createError({ message: 'Time is in the past.' });
  }
  if (timeUntilStart < TRANSACTION_TIME_BUFFER) {
    return this.createError({
      message: 'Please allow for transaction processing time.',
    });
  }
  return true;
}

function validateDiscountedTokensAmount(value) {
  const { tokensAmount } = this.parent;

  if (value > 0 && (!tokensAmount || value > tokensAmount)) {
    return this.createError({
      message: 'Cannot be higher than the total amount of tokens.',
    });
  }

  return true;
}

function validateIsAddress(value) {
  if (!Web3.utils.isAddress(value)) {
    return this.createError({
      message: 'Is an invalid address',
    });
  }

  return true;
}

const requiredMessage = 'Required.';
/* eslint-disable no-template-curly-in-string */
const moreThanMessage = 'Must be higher than ${more}.';
const minMessage = 'Must be at least ${min}.';
const maxPercentageMessage = 'Cannot be higher than 100.';
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
    .min(0, minMessage)
    .test('validateDiscountedTokensAmount', validateDiscountedTokensAmount),
  discountedTokensRate: Yup.number()
    .typeError(requiredMessage)
    .max(1, maxPercentageMessage)
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
    .typeError(requiredMessage)
    .required(requiredMessage)
    .test('validEndTime', validateEndTime),
  currencies: Yup.array()
    .of(Yup.string())
    .required(requiredMessage),
  nonAccreditedMax: Yup.number()
    .typeError(requiredMessage)
    .required(requiredMessage)
    .min(0, minMessage),
  minimumInvestment: Yup.number()
    .typeError(requiredMessage)
    .required(requiredMessage)
    .min(0, minMessage),
  receiverAddress: Yup.string()
    .typeError(requiredMessage)
    .required(requiredMessage)
    .test('validateIsAddress', validateIsAddress),
  unsoldTokensAddress: Yup.string()
    .typeError(requiredMessage)
    .required(requiredMessage)
    .test('validateIsAddress', validateIsAddress),
  investmentTiers: Yup.object().shape({
    isMultipleTiers: Yup.boolean(),
    tiers: Yup.array().of(investmentTierSchema),
    newTier: investmentTierSchema.nullable(),
  }),
});

const initialValues = {
  startDate: new Date(Date.now() + 1000 * 360 * 24),
  endDate: new Date(Date.now() + 1000 * 360 * 24 * 10),
  startTime: 0,
  endTime: 0,
  investmentTiers: {
    isMultipleTiers: false,
    tiers: [],
    newTier: null,
  },
  nonAccreditedMax: 0,
  minimumInvestment: 0,
  receiverAddress: '',
  unsoldTokensAddress: '',
  currencies: ['ETH', 'POLY'],
};

export const USDTieredSTOFormComponent = ({
  onSubmit,
  ticker,
  values,
  errors,
  handleSubmit,
}: ComponentProps) => {
  const { tiers } = values.investmentTiers;
  const totalTokensAmount = reduce(
    tiers,
    (total, { tokensAmount }) => {
      return (isNumber(tokensAmount) ? tokensAmount : 0) + total;
    },
    0
  );
  const totalUsdAmount = reduce(
    tiers,
    (total, { tokenPrice, tokensAmount }) => {
      const amount = isNumber(tokensAmount) ? tokensAmount : 0;
      const price = isNumber(tokenPrice) ? tokenPrice : 0;
      return price * amount + total;
    },
    0
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Heading variant="h3">STO Schedule</Heading>
      <Box mb={4}>
        <div className="time-pickers-container">
          <FormItem name="startDate">
            <FormItem.Label>Start Date</FormItem.Label>
            <FormItem.Input
              component={DatePickerInput}
              placeholder="mm / dd / yyyy"
            />
            <FormItem.Error />
          </FormItem>
          <FormItem name="startTime">
            <FormItem.Label>Time</FormItem.Label>
            <FormItem.Input component={TimePickerSelect} placeholder="hh:mm" />
            <FormItem.Error />
          </FormItem>
          <FormItem name="endDate">
            <FormItem.Label>End Date</FormItem.Label>
            <FormItem.Input
              component={DatePickerInput}
              placeholder="mm / dd / yyyy"
            />
            <FormItem.Error />
          </FormItem>
          <FormItem name="endTime">
            <FormItem.Label>Time</FormItem.Label>
            <FormItem.Input component={TimePickerSelect} placeholder="hh:mm" />
            <FormItem.Error />
          </FormItem>
        </div>
      </Box>

      <Heading variant="h3">STO Financing Details & Terms</Heading>

      <FormItem name="currencies">
        <FormItem.Input component={CurrencySelect} placeholder="Raise in" />
        <FormItem.Error />
      </FormItem>

      <Grid gridAutoFlow="column" gridAutoColumns="1fr">
        <FormItem name="minimumInvestment">
          <FormItem.Label>
            <br />
            <Tooltip triggerText="Minimum investment for All investors">
              <p className="bx--tooltip__label">
                Minimum investment for All investors
              </p>
            </Tooltip>
          </FormItem.Label>
          <FormItem.Input
            component={NumberInput}
            min={0}
            placeholder="Enter amount"
            unit="USD"
          />
          <FormItem.Error />
        </FormItem>

        <FormItem name="nonAccreditedMax">
          <FormItem.Label>
            <Tooltip triggerText="Maximum Investment for Non-Accredited Investors by Default">
              <p className="bx--tooltip__label">
                Maximum Investment for Non-Accredited Investors by Default
              </p>
              <p>
                Conversion rate between the currency you chose and your Security
                Token. E.g. 1000 means that 1 ETH (or POLY) will buy 1000
                Security Tokens.
              </p>
            </Tooltip>
          </FormItem.Label>
          <FormItem.Input
            component={NumberInput}
            placeholder="Enter amount"
            unit="USD"
          />
          <FormItem.Error />
        </FormItem>
      </Grid>

      <div>
        <FastField
          name="investmentTiers"
          ticker={ticker}
          component={InvestmentTiers}
        />
      </div>

      <Grid gridAutoFlow="column" gridAutoColumns="1fr" mb={5}>
        <Grid.Item gridColumn="span 1 / 3">
          <RaisedAmount
            title="Amount Of Funds the STO Will Raise"
            primaryAmount={totalUsdAmount}
            primaryUnit="USD"
            tokenAmount={totalTokensAmount}
            tokenUnit={ticker.toUpperCase()}
          />
        </Grid.Item>
      </Grid>

      <Heading variant="h3">ETH Addresses</Heading>

      <Remark title="Note">
        Before submitting to the chain, we recommend that you test sending funds
        to the wallet that is different from his own as well as retrieve funds
        from this wallet.
      </Remark>

      <FormItem name="receiverAddress">
        <FormItem.Label>
          <Tooltip triggerText="ETH Address to Receive the Funds Raised During the STO">
            <p className="bx--tooltip__label">
              ETH Address to Receive the Funds Raised During the STO
            </p>
          </Tooltip>
        </FormItem.Label>
        <FormItem.Input
          component={TextInput}
          placeholder="Enter your current ETH address"
        />
        <FormItem.Error />
      </FormItem>

      <FormItem name="unsoldTokensAddress">
        <FormItem.Label>
          <Tooltip triggerText="ETH Address for Unsold Tokens">
            <p className="bx--tooltip__label">ETH Address for Unsold Tokens</p>
          </Tooltip>
        </FormItem.Label>
        <FormItem.Input
          component={TextInput}
          placeholder="Enter your current ETH address"
        />
        <FormItem.Error />
      </FormItem>

      <Button type="submit">Confirm & launch STO</Button>
    </Form>
  );
};

const mapStateToProps = ({
  sto: {
    factory: { address },
  },
  token: {
    token: { ticker },
  },
}: RootState) => ({ address, ticker });

type InvestmentTier = {|
  tokensAmount: number,
  tokenPrice: number,
  discountedTokensAmount: number,
  discountedTokensRate: number,
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

const formikEnhancer = withFormik({
  validationSchema: formSchema,
  displayName: 'USDTieredSTOConfigForm',
  validateOnChange: false,
  mapPropsToValues: () => {
    return initialValues;
  },
  handleSubmit: (values: FormValues, { props }) => {
    const { dispatch, address } = props;

    const formattedValues = {
      startsAt: moment(values.startDate).unix() * 1000 + values.startTime,
      endsAt: moment(values.endDate).unix() * 1000 + values.endTime,
      ratePerTier: map(values.investmentTiers.tiers, ({ tokenPrice }) =>
        toWei(tokenPrice)
      ),
      discountRatePerTier: map(
        values.investmentTiers.tiers,
        ({ discountedTokensRate = 0, tokenPrice }) =>
          toWei(`${tokenPrice * (1 - discountedTokensRate)}`)
      ),
      tokensPerTier: map(values.investmentTiers.tiers, ({ tokensAmount }) =>
        toWei(tokensAmount)
      ),
      discountTokensPerTier: map(
        values.investmentTiers.tiers,
        ({ discountedTokensAmount = 0 }) => toWei(discountedTokensAmount)
      ),
      nonAccreditedLimit: toWei(values.nonAccreditedMax),
      minimumInvestment: toWei(values.minimumInvestment),
      currencies: map(
        values.currencies,
        currency => FUND_RAISE_TYPES[currency]
      ),
      receiverAddress: values.receiverAddress,
      unsoldTokensAddress: values.unsoldTokensAddress,
    };

    const config = {
      data: formattedValues,
    };

    dispatch(configureSTO(address, config)).catch(error => {
      throw error;
    });
  },
});

class USDTieredSTOFormContainer extends Component<ContainerProps> {
  shouldComponentUpdate(nextProps: ContainerProps) {
    return nextProps.values === this.props.values;
  }
  render() {
    const { ticker, handleSubmit, errors, values, touched } = this.props;

    return (
      <USDTieredSTOFormComponent
        errors={errors}
        values={values}
        touched={touched}
        ticker={ticker}
        handleSubmit={handleSubmit}
      />
    );
  }
}

const FormikEnhancedForm = formikEnhancer(USDTieredSTOFormContainer);
const ConnectedForm = connect(mapStateToProps)(FormikEnhancedForm);

export default ConnectedForm;
