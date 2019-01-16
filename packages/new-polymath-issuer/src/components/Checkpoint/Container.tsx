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

export class ContainerBase extends Component<Props> {
  public openDividendModal() {

  }
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
          const { checkpoints: [checkpoint] } = data;
          // TODO @monitz87: pass the actual props to the presenter when it is implemented
          return <Presenter />;
        }}
      />
    );
  }
}

export const Container = connect()(ContainerBase);
