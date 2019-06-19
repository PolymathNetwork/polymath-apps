import React, { FC, useState, useEffect, useRef } from 'react';
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
  FormWrapper,
  validator,
  NumberInput,
} from '@polymathnetwork/new-ui';
import {
  types,
  constants,
  validators,
  formatters,
} from '@polymathnetwork/new-shared';
import BigNumber from 'bignumber.js';
import { ExclusionEntry } from '~/pages/DividendsWizard/Presenter';
import { CreateDividendDistributionParams } from '~/pages/DividendsWizard/Container';
import { RootState } from '~/state/store';
import { getApp, getSession } from '~/state/selectors';
import { connect } from 'react-redux';
import {
  validateYupSchema,
  yupToFormErrors,
  FormikErrors,
  FormikTouched,
} from 'formik';
import {
  Wallet,
  GetErc20BalanceByAddressAndWalletArgs,
  GetIsValidErc20ByAddressArgs,
} from '~/types';

interface Props {
  excludedWallets: null | ExclusionEntry[];
  createDividendDistribution: (
    params: CreateDividendDistributionParams
  ) => void;
  networkId?: constants.NetworkIds;
  wallet?: Wallet;
  updateDividendAmount: (dividendAmount: BigNumber) => void;
  updateCurrencySymbol: (currencySymbol: string) => void;
  symbol: string;
  fetchBalance: (
    args: GetErc20BalanceByAddressAndWalletArgs
  ) => Promise<types.Erc20TokenBalancePojo>;
  fetchIsValidToken: (args: GetIsValidErc20ByAddressArgs) => Promise<boolean>;
}
interface Values {
  currency: types.Tokens | null;
  distributionName: string;
  dividendAmount: BigNumber | null;
  tokenAddress: string;
}

interface SubmitParams {
  submitEvent: React.FormEvent<HTMLFormElement>;
  currency: types.Tokens | null;
  setFieldTouched: any;
  isValid: boolean;
  initialValues: Values;
  touched: FormikTouched<Values>;
}

const dividendsTitleLength = 32;

const schema = validator.object().shape({
  currency: validator.string().isRequired('Currency is required'),
  distributionName: validator
    .string()
    .isRequired('Distribution name is required')
    .nullable(true)
    .max(dividendsTitleLength, 'Character limit exceeded'),
  dividendAmount: validator
    .bigNumber()
    .isRequired('Amount is required')
    .moreThan(0, 'Amount should be more than 0')
    .max(new BigNumber('1000000000000000000'), 'Amount exceeds maximum'),
  tokenAddress: validator.string(),
});

const mapStateToProps = (state: RootState) => {
  const { networkId } = getApp(state);
  const { wallet } = getSession(state);

  return { networkId, wallet };
};

/**
 * NOTE @monitz87: I had to use a horrible pattern using refs and hooks in order to
 * perform certain validations only when submitting (async ones in this case). We should
 * revisit this and consider either moving away from formik or coming up with an alternative
 * to this pattern
 */
const Step3Base: FC<Props> = ({
  excludedWallets,
  createDividendDistribution,
  networkId,
  wallet,
  fetchBalance,
  fetchIsValidToken,
  updateDividendAmount,
  updateCurrencySymbol,
}) => {
  if (!networkId) {
    throw new Error("Couldn't obtain network id");
  }

  if (!wallet) {
    throw new Error("Couldn't obtain user wallet");
  }

  const formWrapperRef = useRef<FormWrapper<Values>>(null);

  const [formSubmissionStatus, setFormSubmissionStatus] = useState<{
    isSubmitting: boolean;
    submitEvent?: React.FormEvent<HTMLFormElement>;
  }>({
    isSubmitting: false,
  });

  const [erc20TokenSymbol, setErc20TokenSymbol] = useState('');

  const isTestNet = [
    constants.NetworkIds.Kovan,
    constants.NetworkIds.Local,
    constants.NetworkIds.LocalVm,
  ].includes(networkId);

  useEffect(
    () => {
      const { isSubmitting, submitEvent } = formSubmissionStatus;
      const { current } = formWrapperRef;
      if (!isSubmitting || !current) {
        return;
      }

      current.handleSubmit(submitEvent);
      current.setSubmitting(false);
      setFormSubmissionStatus({
        isSubmitting: false,
      });
    },
    [formSubmissionStatus]
  );

  const getTokenAddress = (
    currency: types.Tokens | null,
    inputAddress: string
  ) => {
    switch (currency) {
      case types.Tokens.Erc20: {
        return inputAddress;
      }
      case types.Tokens.Dai:
      case types.Tokens.Gusd:
      case types.Tokens.Usdc:
      case types.Tokens.Usdt:
      case types.Tokens.Pax:
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

  const handleValidation = async (values: Values) => {
    const errors: FormikErrors<Values> = {};
    const asyncErrors: FormikErrors<Values> = {};
    let schemaErrors: FormikErrors<Values> = {};

    const { currency, tokenAddress, dividendAmount } = values;

    const customTokenSelected = currency === types.Tokens.Erc20;

    // Validate custom ERC20 token address if required
    if (customTokenSelected) {
      if (!tokenAddress) {
        errors.tokenAddress = 'Token address is required';
      } else if (!validators.isEthereumAddress(tokenAddress)) {
        errors.tokenAddress = 'Token address is invalid';
      }
    }

    try {
      await validateYupSchema(values, schema, true);
    } catch (err) {
      schemaErrors = yupToFormErrors<Values>(err);
    }

    if (formSubmissionStatus.isSubmitting) {
      const erc20Address = getTokenAddress(currency, tokenAddress);

      if (dividendAmount && erc20Address) {
        try {
          const { balance, tokenSymbol } = await fetchBalance({
            tokenAddress: erc20Address,
            walletAddress: wallet.address,
          });

          const difference = dividendAmount.minus(balance);
          const willUseFaucet = isTestNet && currency === types.Tokens.Poly;

          if (!willUseFaucet && difference.gte(0)) {
            asyncErrors.dividendAmount = `Insufficient funds. You need ${formatters.toTokens(
              difference
            )} more ${
              currency === types.Tokens.Erc20 ? tokenSymbol : currency
            }`;
          }

          // The faucet reverts if more than 1,000,000 tokens are requested
          if (willUseFaucet && difference.gte(1000000)) {
            asyncErrors.dividendAmount =
              'Cannot request more than 1,000,000 tokens from faucet. Try a smaller amount';
          }
        } catch (err) {
          asyncErrors.dividendAmount =
            'There was a problem while fetching your balance. Please try again later';
        }
      }
    }

    const allErrors = {
      ...errors,
      ...schemaErrors,
      ...asyncErrors,
    };

    if (Object.keys(allErrors).length) {
      setFormSubmissionStatus({
        isSubmitting: false,
      });
      throw allErrors;
    }
  };

  const handleSubmit = (submitParams: SubmitParams) => {
    const {
      submitEvent,
      currency,
      setFieldTouched,
      isValid,
      initialValues,
      touched,
    } = submitParams;
    submitEvent.preventDefault();
    for (const key of Object.keys(initialValues || {})) {
      if (Object.keys(touched).indexOf(key) === -1) {
        if (key !== 'tokenAddress' || currency === types.Tokens.Erc20) {
          setFieldTouched(`${key}`, true);
        }
      }
    }
    if (isValid) {
      submitEvent.persist();
      submitEvent.preventDefault();
      setFormSubmissionStatus({
        isSubmitting: true,
        submitEvent,
      });
    }
  };

  return (
    <Card p="gridGap">
      <Heading variant="h2" mb="l">
        3. Set Dividends Distribution Parameters
      </Heading>
      <FormWrapper<Values>
        enableReinitialize
        ref={formWrapperRef}
        initialValues={{
          currency: null,
          distributionName: '',
          dividendAmount: null,
          tokenAddress: '',
        }}
        validate={handleValidation}
        onSubmit={onSubmit}
        render={({
          values,
          setFieldTouched,
          isValid,
          initialValues,
          setFieldError,
          touched,
        }) => {
          const { currency, tokenAddress } = values;
          return (
            <form
              onSubmit={submitEvent => {
                handleSubmit({
                  submitEvent,
                  currency,
                  setFieldTouched,
                  isValid,
                  initialValues,
                  touched,
                });
              }}
            >
              <Grid gridGap="gridGap" gridAutoFlow="row" maxWidth={512}>
                <FormItem name="distributionName">
                  <FormItem.Label>Dividend Distribution Name</FormItem.Label>
                  <FormItem.Input
                    component={TextInput}
                    inputProps={{
                      maxLength: dividendsTitleLength,
                      placeholder: 'Enter the name',
                    }}
                  />
                  <FormItem.Error />
                </FormItem>
                <FormItem name="currency">
                  <FormItem.Label>Issue in</FormItem.Label>
                  <FormItem.Input
                    component={CurrencySelect}
                    inputProps={{
                      options: [
                        {
                          value: types.Tokens.Erc20,
                        },
                        {
                          value: types.Tokens.Dai,
                        },
                        {
                          value: types.Tokens.Gusd,
                          isDisabled: isTestNet,
                        },
                        {
                          value: types.Tokens.Pax,
                          isDisabled: isTestNet,
                        },
                        {
                          value: types.Tokens.Poly,
                        },
                        {
                          value: types.Tokens.Usdc,
                          isDisabled: isTestNet,
                        },
                        {
                          value: types.Tokens.Usdt,
                          isDisabled: isTestNet,
                        },
                      ],
                      placeholder: 'Choose currency',
                      disabledOptionText: 'Not available on test network',
                    }}
                    onChange={(selectedCurrency: string) =>
                      updateCurrencySymbol(
                        selectedCurrency === types.Tokens.Erc20
                          ? erc20TokenSymbol
                          : selectedCurrency
                      )
                    }
                  />
                  <FormItem.Error />
                </FormItem>
                {currency === types.Tokens.Erc20 && (
                  <FormItem name="tokenAddress">
                    <FormItem.Label>
                      Token Contract Address{' '}
                      <TooltipIcon>
                        Enter the contract address of the custom token that will
                        be used to distribute dividends. This custom token can
                        be any ST20 or ERC20 compatible token, including
                        stablecoins.
                      </TooltipIcon>
                    </FormItem.Label>
                    <FormItem.Input
                      component={TextInput}
                      onBlur={async () => {
                        let isValidErc20 = false;

                        setErc20TokenSymbol('');
                        updateCurrencySymbol('');

                        try {
                          isValidErc20 = await fetchIsValidToken({
                            tokenAddress,
                          });
                        } catch (e) {
                          // do nothing
                        }

                        if (!isValidErc20) {
                          setFieldError(
                            'tokenAddress',
                            'The supplied address does not correspond to a valid ERC20 token'
                          );
                          return;
                        }

                        try {
                          const tokenDetails = await fetchBalance({
                            tokenAddress,
                            walletAddress: wallet.address,
                          });
                          setErc20TokenSymbol(tokenDetails.tokenSymbol || '');
                          updateCurrencySymbol(tokenDetails.tokenSymbol || '');
                        } catch (e) {
                          // do nothing
                        }
                      }}
                      inputProps={{
                        placeholder: 'Enter ERC20 token contract address',
                      }}
                    />
                    <FormItem.Error />
                  </FormItem>
                )}
                <Box width="336px" mt={0}>
                  <FormItem name="dividendAmount">
                    <FormItem.Label>Dividend Amount</FormItem.Label>
                    <FormItem.Input
                      component={NumberInput}
                      inputProps={{
                        min: new BigNumber(0),
                        max: new BigNumber('1000000000000000000'),
                        maxDecimals: 2,
                        unit:
                          currency === types.Tokens.Erc20
                            ? erc20TokenSymbol
                            : currency,
                        useBigNumbers: true,
                        placeholder: 'Enter the value',
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
