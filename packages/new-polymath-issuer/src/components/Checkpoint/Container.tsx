import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Presenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import {
  createCheckpointBySymbolAndIdFetcher,
  createDividendsByCheckpointFetcher,
} from '~/state/fetchers';
import { types } from '@polymathnetwork/new-shared';

export interface Props {
  dispatch: Dispatch<any>;
  symbol: string;
  checkpointIndex: number;
}

export class ContainerBase extends Component<Props> {
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
