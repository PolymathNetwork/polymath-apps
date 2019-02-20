import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { CheckpointPresenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { createDividendsByCheckpointFetcher } from '~/state/fetchers';
import { types, utils, formatters } from '@polymathnetwork/new-shared';
import { BigNumber } from 'bignumber.js';
import { DateTime } from 'luxon';

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

export class CheckpointContainerBase extends Component<Props> {
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
          createDividendsByCheckpointFetcher({
            securityTokenSymbol: symbol,
            checkpointIndex,
          }),
        ]}
        render={({ dividends }: { dividends: types.DividendEntity[] }) => {
          return <CheckpointPresenter symbol={symbol} dividends={dividends} />;
        }}
      />
    );
  }
}

export const CheckpointContainer = connect()(CheckpointContainerBase);
