import React, { Fragment, Component, FC, useCallback } from 'react';
import {
  Box,
  Button,
  Heading,
  Card,
  Grid,
  FormItem,
  TextInput,
  CurrencySelect,
  TooltipIcon,
  Form,
  NumberInput,
  validator,
} from '@polymathnetwork/new-ui';
import { types, constants, validators } from '@polymathnetwork/new-shared';
import BigNumber from 'bignumber.js';
import { ExclusionEntry } from '~/pages/DividendsWizard/Presenter';
import { CreateDividendDistributionParams } from '~/pages/DividendsWizard/Container';
import { RootState } from '~/state/store';
import { getApp } from '~/state/selectors';
import { connect } from 'react-redux';
import { validateYupSchema, yupToFormErrors, FormikErrors } from 'formik';

interface Props {
  excludedWallets: null | ExclusionEntry[];
  createDividendDistribution: (
    params: CreateDividendDistributionParams
  ) => void;
  networkId?: constants.NetworkIds;
  updateDividendAmount: (dividendAmount: BigNumber) => void;
}
interface Values {
  currency: types.Tokens | null;
  distributionName: string;
  dividendAmount: BigNumber | null;
  tokenAddress: string;
}

const schema = validator.object().shape({
  currency: validator.string().required('Currency is required'),
  distributionName: validator
    .string()
    .nullable(true)
    .required('Distribution name is required'),
  dividendAmount: validator
    .bigNumber()
    .min(0, 'Amount cannot be less than 0')
    .max(new BigNumber('1000000000000000000'), 'Amount exceeds maximum')
    .required('Amount is required'),
  tokenAddress: validator.string(),
});

const mapStateToProps = (state: RootState) => {
  const { networkId } = getApp(state);

  return { networkId };
};

const Step3Base: FC<Props> = ({
  excludedWallets,
  createDividendDistribution,
  networkId,
  updateDividendAmount,
}) => {
  const onSubmit = (values: Values) => {
    const { currency, distributionName, dividendAmount, tokenAddress } = values;
    if (!networkId) {
      throw new Error("Couldn't obtain network id");
    }

    let erc20Address: string;

    switch (currency) {
      case types.Tokens.Erc20: {
        erc20Address = tokenAddress;
        break;
      }
      case types.Tokens.Dai:
      case types.Tokens.Poly: {
        erc20Address = constants.TokenAddresses[networkId][currency];
        break;
      }
      default: {
        throw new Error('Unsupported token');
      }
    }

    const excludedAddresses = (excludedWallets || []).map(
      excluded => excluded['Investor ETH Address']
    );

    createDividendDistribution({
      erc20Address,
      excludedAddresses,
      amount: dividendAmount!, // asserted because it has to have been validated previously
      name: distributionName,
    });
  };

  const handleValidation = (values: Values) => {
    const errors: {
      [key: string]: string | FormikErrors<any>;
    } = {};
    let schemaErrors = {};

    // Validate custom ERC20 token address if required
    if (values.currency === types.Tokens.Erc20) {
      if (!values.tokenAddress) {
        errors.tokenAddress = 'Token address is required';
      }
      if (!validators.isEthereumAddress(values.tokenAddress)) {
        errors.tokenAddress = 'Token address is invalid';
      }
    }
    try {
      validateYupSchema(values, schema, true);
    } catch (err) {
      schemaErrors = yupToFormErrors(err);
    }

    const allErrors = {
      ...errors,
      ...schemaErrors,
    };

    if (Object.keys(allErrors).length) {
      return allErrors;
    }
  };

  return (
    <Card p="gridGap">
      <Heading variant="h2" mb="l">
        3. Set Dividends Distribution Parameters
      </Heading>
      <Form<Values>
        enableReinitialize
        initialValues={{
          currency: null,
          distributionName: '',
          dividendAmount: null,
          tokenAddress: '',
        }}
        validate={handleValidation}
        onSubmit={onSubmit}
        render={({ handleSubmit, values }) => {
          const { currency } = values;
          return (
            <form onSubmit={handleSubmit}>
              <Grid gridGap="gridGap" gridAutoFlow="row" width={512}>
                <FormItem name="distributionName">
                  <FormItem.Label>Dividend Distribution Name</FormItem.Label>
                  <FormItem.Input
                    component={TextInput}
                    placeholder="Enter the name"
                  />
                  <FormItem.Error />
                </FormItem>
                <FormItem name="currency">
                  <FormItem.Label>Issue in</FormItem.Label>
                  <FormItem.Input
                    component={CurrencySelect}
                    inputProps={{
                      options: [
                        types.Tokens.Erc20,
                        types.Tokens.Dai,
                        types.Tokens.Poly,
                      ],
                    }}
                    placeholder="Choose currency"
                  />
                  <FormItem.Error />
                </FormItem>
                {currency === types.Tokens.Erc20 && (
                  <FormItem name="tokenAddress">
                    <FormItem.Label>Token Contract Address</FormItem.Label>
                    <FormItem.Input
                      component={TextInput}
                      placeholder={'Enter ERC20 token contract address'}
                    />
                    <FormItem.Error />
                  </FormItem>
                )}
                <Box width="336px" mt={0}>
                  <FormItem name="dividendAmount">
                    <FormItem.Label>Dividend Amount</FormItem.Label>
                    <FormItem.Input
                      component={NumberInput}
                      placeholder="Enter the value"
                      inputProps={{
                        min: new BigNumber(0),
                        max: new BigNumber('1000000000000000000'),
                        unit: values.currency,
                        useBigNumbers: true,
                      }}
                      onChange={updateDividendAmount}
                    />
                    <FormItem.Error />
                  </FormItem>
                </Box>
              </Grid>
              <Box mt="xl">
                <Button type="submit">Configure Dividends</Button>
              </Box>
            </form>
          );
        }}
      />
    </Card>
  );
};

export const Step3 = connect(mapStateToProps)(Step3Base);
