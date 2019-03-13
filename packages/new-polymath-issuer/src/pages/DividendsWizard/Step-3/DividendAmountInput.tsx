import React, { Component, FC } from 'react';
import { connect } from 'react-redux';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { createErc20TokenBalanceByAddressAndWalletFetcher } from '~/state/fetchers';
import { types } from '@polymathnetwork/new-shared';
import { BigNumber } from 'bignumber.js';
import { FormItem, NumberInput } from '@polymathnetwork/new-ui';

export interface ContainerProps {
  tokenAddress: string;
  walletAddress: string;
  onBalanceFetched: (
    data: { balance: BigNumber; tokenSymbol: string | null }
  ) => void;
  currency: string;
  updateDividendAmount: (dividendAmount: BigNumber) => void;
}

export class DividendAmountInputContainer extends Component<ContainerProps> {
  public onDataFetched = ({
    erc20TokenBalances,
  }: {
    erc20TokenBalances: types.Erc20TokenBalanceEntity[];
  }) => {
    const { onBalanceFetched } = this.props;

    const { balance, tokenSymbol } = erc20TokenBalances[0];

    onBalanceFetched({ balance, tokenSymbol });
  };

  public render() {
    const { tokenAddress, walletAddress } = this.props;
    return (
      <DataFetcher
        fetchers={[
          createErc20TokenBalanceByAddressAndWalletFetcher({
            tokenAddress,
            walletAddress,
          }),
        ]}
        onDataFetched={this.onDataFetched}
        render={(data: {
          erc20TokenBalances: types.Erc20TokenBalanceEntity[];
        }) => {
          const { erc20TokenBalances } = data;
          const { currency, updateDividendAmount } = this.props;
          const tokenBalance = erc20TokenBalances[0];

          return (
            <DividendAmountInputPresenter
              currency={tokenBalance.tokenSymbol || currency}
              updateDividendAmount={updateDividendAmount}
            />
          );
        }}
      />
    );
  }
}

export type PresenterProps = Pick<
  ContainerProps,
  'currency' | 'updateDividendAmount'
>;

export const DividendAmountInputPresenter: FC<PresenterProps> = ({
  currency,
  updateDividendAmount,
}) => (
  <FormItem name="dividendAmount">
    <FormItem.Label>Dividend Amount</FormItem.Label>
    <FormItem.Input
      component={NumberInput}
      placeholder="Enter the value"
      inputProps={{
        min: new BigNumber(0),
        max: new BigNumber('1000000000000000000'),
        unit: currency,
        useBigNumbers: true,
      }}
      onChange={updateDividendAmount}
    />
    <FormItem.Error />
  </FormItem>
);

export const DividendAmountInput = connect()(DividendAmountInputContainer);
