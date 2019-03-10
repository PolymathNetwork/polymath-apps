import React, { Fragment, Component, FC } from 'react';
import {
  Box,
  Button,
  Heading,
  Card,
  Paragraph,
  Grid,
  FormItem,
  TextInput,
  CurrencySelect,
  TooltipIcon,
  Form,
  NumberInput,
} from '@polymathnetwork/new-ui';
import { types, constants } from '@polymathnetwork/new-shared';
import BigNumber from 'bignumber.js';
import { ExclusionEntry } from '~/pages/DividendsWizard/Presenter';
import { CreateDividendDistributionParams } from '~/pages/DividendsWizard/Container';
import { RootState } from '~/state/store';
import { getApp } from '~/state/selectors';
import { connect } from 'react-redux';

interface Props {
  excludedWallets: null | ExclusionEntry[];
  createDividendDistribution: (
    params: CreateDividendDistributionParams
  ) => void;
  networkId?: constants.NetworkIds;
}
interface Values {
  currency: types.Tokens | null;
  distributionName: string;
  dividendAmount: BigNumber | null;
  tokenAddress: string;
}

const mapStateToProps = (state: RootState) => {
  const { networkId } = getApp(state);

  return { networkId };
};

const Step3Base: FC<Props> = ({
  excludedWallets,
  createDividendDistribution,
  networkId,
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
        onSubmit={onSubmit}
        render={({ handleSubmit, isValid, values }) => {
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
                </FormItem>
                {currency === types.Tokens.Erc20 && (
                  <FormItem name="tokenAddress">
                    <FormItem.Label>Token Contract Address</FormItem.Label>
                    <FormItem.Input
                      component={TextInput}
                      placeholder={'Enter ERC20 token contract address'}
                    />
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
                        useBignumbers: true,
                      }}
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
