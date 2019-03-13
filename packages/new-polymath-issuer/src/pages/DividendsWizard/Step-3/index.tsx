import React, { FC, useState } from 'react';
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
  validator,
} from '@polymathnetwork/new-ui';
import { types, constants, validators } from '@polymathnetwork/new-shared';
import BigNumber from 'bignumber.js';
import { ExclusionEntry } from '~/pages/DividendsWizard/Presenter';
import { CreateDividendDistributionParams } from '~/pages/DividendsWizard/Container';
import { RootState } from '~/state/store';
import { getApp, getSession } from '~/state/selectors';
import { connect } from 'react-redux';
import { validateYupSchema, yupToFormErrors, FormikErrors } from 'formik';
import { DividendAmountInput } from '~/pages/DividendsWizard/Step-3/DividendAmountInput';
import { Wallet } from '~/types';

interface Props {
  excludedWallets: null | ExclusionEntry[];
  createDividendDistribution: (
    params: CreateDividendDistributionParams
  ) => void;
  networkId?: constants.NetworkIds;
  wallet?: Wallet;
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
  const { wallet } = getSession(state);

  return { networkId, wallet };
};

const Step3Base: FC<Props> = ({
  excludedWallets,
  createDividendDistribution,
  networkId,
  wallet,
  updateDividendAmount,
}) => {
  const [{ balance, tokenSymbol }, setTokenData] = useState<{
    balance: BigNumber;
    tokenSymbol: string | null;
  }>({ balance: new BigNumber(0), tokenSymbol: null });

  if (!networkId) {
    throw new Error("Couldn't obtain network id");
  }

  const getTokenAddress = (
    currency: types.Tokens | null,
    inputAddress: string
  ) => {
    switch (currency) {
      case types.Tokens.Erc20: {
        return inputAddress;
      }
      case types.Tokens.Dai:
      case types.Tokens.Poly: {
        return constants.TokenAddresses[networkId][currency];
      }
      default: {
        throw new Error('Unsupported token');
      }
    }
  };

  const onSubmit = (values: Values) => {
    const { currency, distributionName, dividendAmount, tokenAddress } = values;

    const erc20Address = getTokenAddress(currency, tokenAddress);

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

    const { currency, dividendAmount, tokenAddress } = values;

    // Validate custom ERC20 token address if required
    if (currency === types.Tokens.Erc20) {
      if (!tokenAddress) {
        errors.tokenAddress = 'Token address is required';
      }
      if (!validators.isEthereumAddress(tokenAddress)) {
        errors.tokenAddress = 'Token address is invalid';
      }
    }

    const isTestNet = [
      constants.NetworkIds.Kovan,
      constants.NetworkIds.Local,
      constants.NetworkIds.LocalVm,
    ].includes(networkId!);
    const shouldValidateAmount = !isTestNet || currency !== types.Tokens.Poly;

    // Validate that the issuer has enough balance of the selected token
    // Skip validation if on testnet and POLY was chosen as the currency
    if (dividendAmount && shouldValidateAmount) {
      if (dividendAmount.gt(balance)) {
        errors.dividendAmount = `Not enough ${tokenSymbol || 'TOKEN'} funds`;
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
        render={({ handleSubmit, values, errors, touched }) => {
          const { currency, tokenAddress } = values;

          const validTokenAddress =
            !errors.tokenAddress && touched.tokenAddress;

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
                    <FormItem.Label>Token Contract Address{" "}
                      <TooltipIcon>
                        Enter the contract address of the custom token that will be used to 
                        distribute dividends. This custom token can be any ST20 or ERC20 
                        compatible token, including stablecoins.
                      </TooltipIcon>
                    </FormItem.Label>
                    <FormItem.Input
                      component={TextInput}
                      placeholder={'Enter ERC20 token contract address'}
                    />
                    <FormItem.Error />
                  </FormItem>
                )}
                <Box width="336px" mt={0}>
                  {currency &&
                    ((currency === types.Tokens.Erc20 && validTokenAddress) ||
                      currency !== types.Tokens.Erc20) &&
                    wallet && (
                      <DividendAmountInput
                        currency={currency}
                        tokenAddress={getTokenAddress(currency, tokenAddress)}
                        onBalanceFetched={setTokenData}
                        updateDividendAmount={updateDividendAmount}
                        walletAddress={wallet.address}
                      />
                    )}
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
