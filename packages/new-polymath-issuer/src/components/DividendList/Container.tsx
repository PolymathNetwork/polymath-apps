import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { DividendListPresenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { createDividendsByCheckpointFetcher } from '~/state/fetchers';
import { types } from '@polymathnetwork/new-shared';

export interface Props {
  dispatch: Dispatch<any>;
  securityTokenSymbol: string;
  checkpointIndex: number;
}

export class DividendListContainerBase extends Component<Props> {
  public render() {
    const { securityTokenSymbol, checkpointIndex } = this.props;
    return (
      <DataFetcher
        fetchers={[
          createDividendsByCheckpointFetcher({
            securityTokenSymbol,
            checkpointIndex,
          }),
        ]}
        render={({ dividends }: { dividends: types.DividendEntity[] }) => {
          return (
            <DividendListPresenter
              securityTokenSymbol={securityTokenSymbol}
              dividends={dividends}
            />
          );
        }}
      />
    );
  }
}

export const DividendListContainer = connect()(DividendListContainerBase);
