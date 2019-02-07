import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Presenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { createCheckpointBySymbolAndIdFetcher } from '~/state/fetchers';
import { types } from '@polymathnetwork/new-shared';

export interface Props {
  dispatch: Dispatch<any>;
  symbol: string;
  checkpointIndex: number;
}

interface Row {
  address: string;
  balance: string;
  percentage: number;
}

export class ContainerBase extends Component<Props> {
  public downloadOwnershipList = (checkpoint: types.CheckpointEntity) => {
    const { symbol } = this.props;
    const { createdAt, investorBalances, totalSupply } = checkpoint;
    const data: Row[] = investorBalances.map(({ balance, address }) => {
      const percentage = balance
        .div(totalSupply)
        .times(new BigNumber(100))
        .toNumber();

      return {
        address,
        balance: balance.valueOf(),
        percentage,
      };
    });

    const fileName = `checkpoint_${symbol.toUpperCase()}_${formatters.toDateFormat(
      createdAt,
      { format: DateTime.DATE_SHORT }
    )}_${totalSupply}`;

    utils.downloadCsvFile(data, fileName, {
      fields: [
        {
          label: 'Wallet Address',
          value: 'address',
        },
        {
          label: 'Held Tokens',
          value: 'balance',
        },
        {
          label: '% of Total Supply',
          value: 'percentage',
        },
      ],
    });
  };
  public render() {
    const { symbol, checkpointIndex } = this.props;
    return (
      <DataFetcher
        fetchers={[
          createCheckpointBySymbolAndIdFetcher({
            securityTokenSymbol: symbol,
            checkpointIndex,
          }),
          createDividendsByCheckpointFetcher({
            securityTokenSymbol: symbol,
            checkpointIndex,
          }),
        ]}
        render={(data: {
          checkpoints: types.CheckpointPojo[];
          dividends: types.DividendPojo[];
        }) => {
          const {
            checkpoints: [checkpoint],
          } = data;
          return (
            <Presenter
              symbol={symbol}
              dividends={checkpoint ? checkpoint.dividends : []}
            />
          );
        }}
      />
    );
  }
}

export const Container = connect()(ContainerBase);
