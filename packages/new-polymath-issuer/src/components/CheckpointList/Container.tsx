import React, { Component } from 'react';
import { flatten, map, every } from 'lodash';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { CheckpointListPresenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import {
  createCheckpointsBySymbolFetcher,
  createDividendsByCheckpointFetcher,
} from '~/state/fetchers';
import { types, formatters, utils } from '@polymathnetwork/new-shared';
import { BigNumber } from 'bignumber.js';
import { DateTime } from 'luxon';
import { DIVIDEND_PAYMENT_INVESTOR_BATCH_SIZE } from '~/constants';

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
    const sanitizedName = securityTokenSymbol.replace('.', '-').toUpperCase();
    const fileName = `checkpoint_${sanitizedName}_${formatters.toDateFormat(
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
        render={(data: { checkpoints: types.CheckpointEntity[] }, loading) => {
          const { checkpoints } = data;
          const fetchers = checkpoints.map(({ index }) =>
            createDividendsByCheckpointFetcher(
              {
                securityTokenSymbol,
                checkpointIndex: index,
              },
              { propKey: `${index}` }
            )
          );

          return (
            <DataFetcher
              watchProps={[loading]}
              fetchers={fetchers}
              render={(dividendsData: {
                [key: string]: types.DividendEntity[];
              }) => {
                const allDividendsCompleted = every(
                  flatten(
                    map(dividendsData, dividends =>
                      map(dividends, dividend => {
                        const { expiry, investors } = dividend;

                        const remainingPayments = investors.filter(
                          investor =>
                            !investor.paymentReceived && !investor.excluded
                        ).length;

                        const remainingTransactions = Math.ceil(
                          remainingPayments /
                            DIVIDEND_PAYMENT_INVESTOR_BATCH_SIZE
                        );

                        return (
                          expiry <= new Date() || remainingTransactions === 0
                        );
                      })
                    )
                  ),
                  (complete: boolean) => complete
                );

                // this spread is necessary because sort mutates the original array and that causes a rerender of the DataFetcher
                const sortedCheckpoints = [...checkpoints].sort(
                  (a, b) => b.index - a.index
                );

                return (
                  <CheckpointListPresenter
                    hasDividends={!!Object.keys(dividendsData).length}
                    allDividendsCompleted={allDividendsCompleted}
                    checkpoints={sortedCheckpoints}
                    securityTokenSymbol={securityTokenSymbol}
                    downloadOwnershipList={this.downloadOwnershipList}
                    loading={loading}
                  />
                );
              }}
            />
          );
        }}
      />
    );
  }
}

export const CheckpointListContainer = connect()(CheckpointListContainerBase);
