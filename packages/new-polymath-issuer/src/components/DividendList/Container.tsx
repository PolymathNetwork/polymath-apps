import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { DividendListPresenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { createDividendsByCheckpointFetcher } from '~/state/fetchers';
import { types } from '@polymathnetwork/new-shared';

export interface Props {
  dispatch: Dispatch<any>;
  symbol: string;
  checkpointId: number;
  allDividendsCompleted: boolean;
  hasDividends: boolean;
}

export class DividendListContainerBase extends Component<Props> {
  public render() {
    const {
      symbol,
      checkpointId,
      allDividendsCompleted,
      hasDividends,
    } = this.props;

    return (
      <DataFetcher
        fetchers={[
          createDividendsByCheckpointFetcher({
            symbol,
            checkpointId,
          }),
        ]}
        render={({ dividends }: { dividends: types.DividendEntity[] }) => {
          // this spread is necessary because sort mutates the original array and that causes a rerender of the DataFetcher
          const sortedDividends = [...dividends].sort(
            (a, b) => b.index - a.index
          );

          return (
            <DividendListPresenter
              symbol={symbol}
              hasDividends={hasDividends}
              dividends={sortedDividends}
              checkpointId={checkpointId}
              allDividendsCompleted={allDividendsCompleted}
            />
          );
        }}
      />
    );
  }
}

export const DividendListContainer = connect()(DividendListContainerBase);
