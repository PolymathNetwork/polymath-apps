import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Presenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { createCheckpointBySymbolAndIdFetcher } from '~/state/fetchers';
import { types, utils } from '@polymathnetwork/new-shared';
import BigNumber from 'bignumber.js';
import moment from 'moment';

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

    const fileName = `checkpoint_${symbol.toUpperCase()}_${moment(
      createdAt
    ).format('MM/DD/YYYY')}_${totalSupply}`;

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
        ]}
        render={(data: { checkpoints: types.CheckpointEntity[] }) => {
          const {
            checkpoints: [checkpoint],
          } = data;
          // TODO @monitz87: pass the actual props to the presenter when it is implemented
          return <Presenter />;
        }}
      />
    );
  }
}

export const Container = connect()(ContainerBase);
