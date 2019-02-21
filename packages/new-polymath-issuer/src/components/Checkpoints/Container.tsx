import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { CheckpointsPresenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { createCheckpointsBySymbolFetcher } from '~/state/fetchers';
import { types } from '@polymathnetwork/new-shared';

export interface Props {
  dispatch: Dispatch<any>;
  securityTokenSymbol: string;
}

export class CheckpointsContainerBase extends Component<Props> {
  public render() {
    const { securityTokenSymbol } = this.props;
    return (
      <DataFetcher
        fetchers={[
          createCheckpointsBySymbolFetcher({
            securityTokenSymbol,
          }),
        ]}
        render={(data: { checkpoints: types.CheckpointPojo[] }) => {
          const { checkpoints } = data;
          if (!checkpoints.length) {
            return null;
          }

          return (
            <CheckpointsPresenter
              checkpoints={checkpoints}
              securityTokenSymbol={securityTokenSymbol}
            />
          );
        }}
      />
    );
  }
}

export const CheckpointsContainer = connect()(CheckpointsContainerBase);
