import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Presenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { createCheckpointsBySymbolFetcher } from '~/state/fetchers';
import { CheckpointEntity } from '~/types';

export interface Props {
  dispatch: Dispatch<any>;
  symbol: string;
}

export class ContainerBase extends Component<Props> {
  public render() {
    const { symbol } = this.props;
    return (
      <DataFetcher
        fetchers={[
          createCheckpointsBySymbolFetcher({
            securityTokenSymbol: symbol,
          }),
        ]}
        render={(data: { checkpoints: CheckpointEntity[] }) => {
          const { checkpoints } = data;
          // TODO @monitz87: pass the actual props to the presenter when it is implemented
          return <Presenter />;
        }}
      />
    );
  }
}

export const Container = connect()(ContainerBase);
