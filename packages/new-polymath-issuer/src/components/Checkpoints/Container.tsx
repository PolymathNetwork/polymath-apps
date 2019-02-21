import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { CheckpointsPresenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { createCheckpointsBySymbolFetcher } from '~/state/fetchers';
import { types } from '@polymathnetwork/new-shared';

export interface Props {
  dispatch: Dispatch<any>;
  symbol: string;
}

export class CheckpointsContainerBase extends Component<Props> {
  public render() {
    const { symbol } = this.props;
    return (
      <DataFetcher
        fetchers={[
          createCheckpointsBySymbolFetcher({
            securityTokenSymbol: symbol,
          }),
        ]}
        render={(data: { checkpoints: types.CheckpointPojo[] }) => {
          const { checkpoints } = data;

          if (!checkpoints.length) {
            return null;
          }

          return (
            <CheckpointsPresenter checkpoints={checkpoints} symbol={symbol} />
          );
        }}
      />
    );
  }
}

export const CheckpointsContainer = connect()(CheckpointsContainerBase);
