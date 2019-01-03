// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { map, reduce } from 'lodash';
import { FastField, withFormik } from 'formik';
import moment from 'moment-timezone';
import { Form, Button } from 'carbon-components-react';
import BigNumber from 'bignumber.js';
import validator from '@polymathnetwork/ui/validator';
import {
  Box,
  Grid,
  FormItem,
  FormItemGroup,
  Heading,
  RaisedAmount,
  Remark,
  Tooltip,
  TextInput,
  DatePickerInput,
  TimePickerSelect,
  NumberInput,
  CurrencySelect,
} from '@polymathnetwork/ui';
import {
  validateEndDate,
  validateEndTime,
  validateTodayOrAfter,
  validateStartTime,
  REQUIRED_MESSAGE,
  MIN_MESSAGE,
  MORE_THAN_MESSAGE,
  ADDRESS_MESSAGE,
} from '../../validators';
import InvestmentTiers from './InvestmentTiers';
import { toWei } from '../../../../../../utils/contracts';
import { FUND_RAISE_TYPES } from '../../../../../../constants';
import { configureSTO } from '../../../../../../actions/sto';

import type { RootState } from '../../../../../../redux/reducer';
import type { FundRaiseType } from '../../../../../../constants';

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

export const investmentTierSchema = validator.object().shape({
  tokensAmount: validator
    .bigNumber()
    .isRequired(REQUIRED_MESSAGE)
    .moreThan(0, MORE_THAN_MESSAGE),
  tokenPrice: validator
    .bigNumber()
    .isRequired(REQUIRED_MESSAGE)
    .moreThan(0, MORE_THAN_MESSAGE),
});

// TODO @RafaelVidaurre: Move reusable validators to yup singleton
const formSchema = validator.object().shape({
  date: validator.object().shape({
    startDate: validator
      .date()
      .isRequired(REQUIRED_MESSAGE)
      .test('validateStartDate', validateTodayOrAfter),
    startTime: validator
      .number()
      .isRequired(REQUIRED_MESSAGE)
      .test('validateStartTime', validateStartTime),
    endDate: validator
      .date()
      .isRequired(REQUIRED_MESSAGE)
      .test('validateEndDate', validateEndDate),
    endTime: validator
      .number()
      .isRequired(REQUIRED_MESSAGE)
      .test('validEndTime', validateEndTime),
  }),
  currencies: validator
    .array()
    .of(validator.string())
    .isRequired(REQUIRED_MESSAGE),
  nonAccreditedMax: validator
    .bigNumber()
    .isRequired(REQUIRED_MESSAGE)
    .min(0, MIN_MESSAGE),
  minimumInvestment: validator
    .bigNumber()
    .isRequired(REQUIRED_MESSAGE)
    .min(0, MIN_MESSAGE),
  receiverAddress: validator
    .string()
    .isRequired(REQUIRED_MESSAGE)
    .isAddress(ADDRESS_MESSAGE),
  unsoldTokensAddress: validator
    .string()
    .isRequired(REQUIRED_MESSAGE)
    .isAddress(ADDRESS_MESSAGE),
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

      <Grid>
        <FormItem name="currencies">
          <FormItem.Input component={CurrencySelect} placeholder="Raise in" />
          <FormItem.Error />
        </FormItem>

        <Grid gridAutoFlow="column" gridAutoColumns="1fr">
          <FormItem name="minimumInvestment">
            <FormItem.Label>
              <br />
              <Tooltip triggerText="Minimum investment for All investors">
                <p>
                  <strong>Minimum investment for All investors</strong>
                </p>
                <p>
                  Any investment below this value, regardless of their origin
                  (accredited or non-accredited investor) will be rejected and
                  the funds sent back to their Investor minus the processing
                  (gas) fee
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
                <p>
                  <strong>
                    Maximum Investment for Non-Accredited Investors by Default
                  </strong>
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

        <FastField
          name="investmentTiers"
          ticker={ticker}
          component={InvestmentTiers}
        />

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
      </Grid>

      <Heading variant="h3" mt={5}>
        ETH Addresses
      </Heading>

      <Grid>
        <Remark title="Note">
          Before we write these addresses to the blockchain, we recommend that
          you test sending to and retrieving funds from them to make sure they
          correspond to the wallets you would like to use.
        </Remark>

        <FormItem name="receiverAddress">
          <FormItem.Label>
            <Tooltip triggerText="ETH Address to Receive the Funds Raised During the STO">
              <p>
                <strong>
                  ETH Address to Receive the Funds Raised During the STO
                </strong>
              </p>
              <p>
                This wallet address will receive the funds raised during the
                STO. This address may be self-custodied or that of a fully
                custodied wallet.
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
              <p>
                <strong>ETH Address for Unsold Tokens</strong>
              </p>
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
      </Grid>

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
    const { dispatch } = props;

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

    dispatch(configureSTO(config, 'USDTieredSTO')).catch(error => {
      throw error;
    });
  },
});

const FormikEnhancedForm = formikEnhancer(USDTieredSTOFormComponent);
const ConnectedForm = connect(mapStateToProps)(FormikEnhancedForm);

export default ConnectedForm;
