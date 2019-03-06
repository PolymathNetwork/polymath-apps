import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { CheckpointListPresenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { createCheckpointsBySymbolFetcher } from '~/state/fetchers';
import { types, formatters, utils } from '@polymathnetwork/new-shared';
import { BigNumber } from 'bignumber.js';
import { DateTime } from 'luxon';

export interface Props {
  dispatch: Dispatch<any>;
  securityTokenSymbol: string;
}

interface Row {
  address: string;
  balance: string;
  percentage: number;
}

export class CheckpointListContainerBase extends Component<Props> {
  public downloadOwnershipList = (checkpoint: types.CheckpointEntity) => {
    const { securityTokenSymbol } = this.props;
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

    const fileName = `checkpoint_${securityTokenSymbol.toUpperCase()}_${formatters.toDateFormat(
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
    const { securityTokenSymbol } = this.props;
    return (
      <DataFetcher
        fetchers={[
          createCheckpointsBySymbolFetcher({
            securityTokenSymbol,
          }),
        ]}
        render={(data: { checkpoints: types.CheckpointEntity[] }) => {
          const { checkpoints } = data;

          // this spread is necessary because sort mutates the original array and that causes a rerender of the DataFetcher
          const sortedCheckpoints = [...checkpoints].sort(
            (a, b) => b.index - a.index
          );

          return (
            <CheckpointListPresenter
              checkpoints={sortedCheckpoints}
              securityTokenSymbol={securityTokenSymbol}
              downloadOwnershipList={this.downloadOwnershipList}
            />
          );
        }}
      />
    );
  }
}

export const CheckpointListContainer = connect()(CheckpointListContainerBase);
