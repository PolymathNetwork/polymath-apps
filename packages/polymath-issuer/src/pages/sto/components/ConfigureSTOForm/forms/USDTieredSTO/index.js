// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { map, reduce } from 'lodash';
import { FastField, withFormik } from 'formik';
import moment from 'moment-timezone';
import { Form, Tooltip, Button } from 'carbon-components-react';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import validator from '@polymathnetwork/shared/validator';
import {
  Box,
  Grid,
  FormItem,
  FormItemGroup,
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

type InvestmentTier = {|
  tokensAmount: number,
  tokenPrice: number,
|};
type FormValues = {|
  date: {
    startDate: Date,
    startTime: number,
    endDate: Date,
    endTime: number,
  },
  investmentTiers: {
    isMultipleTiers: boolean,
    newTier: InvestmentTier,
    tiers: Array<InvestmentTier>,
  },
  nonAccreditedMax: number,
  minimumInvestment: number,
  currencies: FundRaiseType,
  receiverAddress: string,
  unsoldTokensAddress: string,
|};

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
    return this.createError({ message: 'End time must be after start time.' });
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

function isRequired(value) {}

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
/* eslint-enable no-template-curly-in-string */

export const investmentTierSchema = validator.object().shape({
  tokensAmount: validator
    .bigNumber()
    .isRequired(requiredMessage)
    .moreThan(0, moreThanMessage),
  tokenPrice: validator
    .bigNumber()
    .isRequired(requiredMessage)
    .moreThan(0, moreThanMessage),
});

// TODO @RafaelVidaurre: Move reusable validators to yup singleton
const formSchema = validator.object().shape({
  date: validator.object().shape({
    startDate: validator
      .date()
      .isRequired(requiredMessage)
      .test('validateStartDate', todayOrAfter),
    startTime: validator
      .number()
      .isRequired(requiredMessage)
      .test('validateStartTime', validateStartTime),
    endDate: validator
      .date()
      .isRequired(requiredMessage)
      .test('validateEndDate', validateEndDate),
    endTime: validator
      .number()
      .isRequired(requiredMessage)
      .test('validEndTime', validateEndTime),
  }),
  currencies: validator
    .array()
    .of(validator.string())
    .isRequired(requiredMessage),
  nonAccreditedMax: validator
    .bigNumber()
    .isRequired(requiredMessage)
    .min(0, minMessage),
  minimumInvestment: validator
    .bigNumber()
    .isRequired(requiredMessage)
    .min(0, minMessage),
  receiverAddress: validator
    .string()
    .isRequired(requiredMessage)
    .test('validateIsAddress', validateIsAddress),
  unsoldTokensAddress: validator
    .string()
    .isRequired(requiredMessage)
    .test('validateIsAddress', validateIsAddress),
  investmentTiers: validator.object().shape({
    isMultipleTiers: validator.boolean(),
    tiers: validator
      .array()
      .of(investmentTierSchema)
      .isRequired('You must add at least one tier.'),
    newTier: investmentTierSchema.nullable(),
  }),
});

/**
 * NOTE @monitz87: Every field NEEDS to have an initial value because of
 * https://github.com/jaredpalmer/formik/issues/738
 */
const initialValues = {
  investmentTiers: {
    isMultipleTiers: false,
    tiers: [
      {
        tokensAmount: null,
        tokenPrice: null,
      },
    ],
    newTier: null,
  },
  date: {
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
  },
  nonAccreditedMax: new BigNumber(0),
  minimumInvestment: new BigNumber(0),
  receiverAddress: '',
  unsoldTokensAddress: '',
  currencies: ['ETH', 'POLY'],
};

export const USDTieredSTOFormComponent = ({
  onSubmit,
  ticker,
  values,
  errors,
  touched,
  handleSubmit,
}: ComponentProps) => {
  const { tiers } = values.investmentTiers;
  const totalTokensAmount = reduce(
    tiers,
    (total, { tokensAmount }) => {
      return (tokensAmount || new BigNumber(0)).plus(total);
    },
    new BigNumber(0)
  );
  const totalUsdAmount = reduce(
    tiers,
    (total, { tokenPrice, tokensAmount }) => {
      const amount = tokensAmount || new BigNumber(0);
      const price = tokenPrice || new BigNumber(0);
      return total.plus(price.times(amount));
    },
    new BigNumber(0)
  );

  console.log(values);
  console.log(errors);

  return (
    <Form onSubmit={handleSubmit}>
      <Heading variant="h3">STO Schedule</Heading>

      <FormItemGroup>
        <FormItemGroup.Items>
          <FormItem name="date.startDate">
            <FormItem.Label>Start Date</FormItem.Label>
            <FormItem.Input
              component={DatePickerInput}
              placeholder="mm / dd / yyyy"
            />
          </FormItem>
          <Box mr={4}>
            <FormItem name="date.startTime">
              <FormItem.Label>Time</FormItem.Label>
              <FormItem.Input
                component={TimePickerSelect}
                placeholder="hh:mm"
              />
            </FormItem>
          </Box>
          <FormItem name="date.endDate">
            <FormItem.Label>End Date</FormItem.Label>
            <FormItem.Input
              component={DatePickerInput}
              placeholder="mm / dd / yyyy"
            />
          </FormItem>
          <FormItem name="date.endTime">
            <FormItem.Label>Time</FormItem.Label>
            <FormItem.Input component={TimePickerSelect} placeholder="hh:mm" />
          </FormItem>
        </FormItemGroup.Items>
        <FormItemGroup.Error name="date" errors={errors} touched={touched} />
      </FormItemGroup>

      <Heading variant="h3" mt={5}>
        STO Financing Details & Terms
      </Heading>

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
              <p>
                Any investment below this value, regardless of their origin
                (accredited or non-accredited investor) will be rejected and the
                funds sent back to their Investor minus the processing (gas) fee
              </p>
            </Tooltip>
          </FormItem.Label>
          <FormItem.Input
            component={NumberInput}
            min={0}
            placeholder="Enter amount"
            unit="USD"
            useBigNumbers
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
                By default, Investors are assumed to be non-accredited (i.e.
                Retail Investors) unless they are explicitly marked as
                Accredited in the whitelist. All Non-Accredited investors are
                subject to this maximum investment limit by default, unless
                their wallet address is added to the whitelist with an
                associated limit.
              </p>
            </Tooltip>
          </FormItem.Label>
          <FormItem.Input
            component={NumberInput}
            placeholder="Enter amount"
            unit="USD"
            useBigNumbers
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

      <Grid gridAutoFlow="column" gridAutoColumns="1fr">
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

      <Heading variant="h3" mt={5}>
        ETH Addresses
      </Heading>

      <Remark title="Note">
        Before submitting to the chain, we recommend that you test sending funds
        to the wallet that is different from his own as well as retrieve funds
        from this wallet.
      </Remark>

      <FormItem name="receiverAddress">
        <FormItem.Label>
          <Tooltip triggerText="ETH Address to Receive the Funds Raised During the STO">
            <p className="bx--tooltip__label">
              This wallet address will receive the funds raised during the STO.
              This address may be self-custodied or that of a fully custodied
              wallet.
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
            <p>
              This wallet address will receive all tokens not sold across all
              tiers defined in the STO, by the time the STO reaches its end
              date/time or is manually stopped.
            </p>
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
      startsAt:
        moment(values.date.startDate).unix() * 1000 + values.date.startTime,
      endsAt: moment(values.date.endDate).unix() * 1000 + values.date.endTime,
      ratePerTier: map(values.investmentTiers.tiers, ({ tokenPrice }) =>
        toWei(tokenPrice)
      ),
      discountRatePerTier: map(values.investmentTiers.tiers, () => toWei('0')),
      tokensPerTier: map(values.investmentTiers.tiers, ({ tokensAmount }) =>
        toWei(tokensAmount)
      ),
      discountTokensPerTier: map(values.investmentTiers.tiers, () =>
        toWei('0')
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
