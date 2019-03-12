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
  filterNameBy: string;
}

export class DividendListContainerBase extends Component<Props> {
  public render() {
    const { securityTokenSymbol, checkpointIndex, filterNameBy } = this.props;
    return (
      <DataFetcher
        fetchers={[
          createDividendsByCheckpointFetcher({
            securityTokenSymbol,
            checkpointIndex,
          }),
        ]}
        render={({ dividends }: { dividends: types.DividendEntity[] }) => {
          // this spread is necessary because sort mutates the original array and that causes a rerender of the DataFetcher
          const sortedDividends = [...dividends].sort(
            (a, b) => b.index - a.index
          );

          return (
            <DividendListPresenter
              securityTokenSymbol={securityTokenSymbol}
              dividends={sortedDividends}
              checkpointIndex={checkpointIndex}
              filterNameBy={filterNameBy}
            />
          );
        }}
      />
    );
  }
}

export const DividendListContainer = connect()(DividendListContainerBase);
