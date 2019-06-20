import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ActionType } from 'typesafe-actions';
import { types, constants } from '@polymathnetwork/new-shared';
import { Page } from '@polymathnetwork/new-ui';
import { Presenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import {
  createTaxWithholdingListBySymbolAndCheckpointFetcher,
  createDividendBySymbolAndIdFetcher,
} from '~/state/fetchers';
import { RootState } from '~/state/store';
import { getApp } from '~/state/selectors';
import {
  pushDividendPaymentStart,
  withdrawDividendTaxesStart,
} from '~/state/actions/procedures';
import { DividendModuleTypes } from '@polymathnetwork/sdk';

const actions = {
  pushDividendPaymentStart,
  withdrawDividendTaxesStart,
};

export interface Props {
  dispatch: Dispatch<ActionType<typeof actions>>;
  symbol: string;
  dividendIndex: string;
  checkpointId: number;
  networkId?: number;
}

const mapStateToProps = (state: RootState) => {
  const { networkId } = getApp(state);
  return { networkId };
};

export class ContainerBase extends Component<Props> {
  public pushDividendPayments = () => {
    const { dispatch, symbol, dividendIndex } = this.props;

    dispatch(
      pushDividendPaymentStart({
        symbol,
        dividendType: DividendModuleTypes.Erc20,
        dividendIndex: parseInt(dividendIndex, 10),
      })
    );
  };
  public withdrawTaxes = () => {
    const { dispatch, symbol, dividendIndex } = this.props;

    dispatch(
      withdrawDividendTaxesStart({
        symbol,
        dividendType: DividendModuleTypes.Erc20,
        dividendIndex: parseInt(dividendIndex, 10),
      })
    );
  };

  public render() {
    const { symbol, dividendIndex, checkpointId, networkId } = this.props;
    const subdomain = networkId ? constants.EtherscanSubdomains[networkId] : '';
    return (
      <Page title="Dividend Details">
        <DataFetcher
          fetchers={[
            createTaxWithholdingListBySymbolAndCheckpointFetcher({
              symbol,
              checkpointId: parseInt(checkpointId, 10),
              dividendType: DividendModuleTypes.Erc20,
            }),
            createDividendBySymbolAndIdFetcher({
              symbol,
              dividendType: DividendModuleTypes.Erc20,
              dividendIndex: parseInt(dividendIndex, 10),
            }),
          ]}
          render={(
            data: {
              taxWithholdings: types.TaxWithholdingEntity[];
              dividends: types.DividendEntity[];
            },
            loading
          ) => {
            const {
              taxWithholdings,
              dividends: [dividend],
            } = data;
            return (
              <Presenter
                subdomain={subdomain}
                symbol={symbol}
                dividend={dividend}
                taxWithholdings={taxWithholdings}
                pushDividendPayments={this.pushDividendPayments}
                withdrawTaxes={this.withdrawTaxes}
                loading={loading}
              />
            );
          }}
        />
      </Page>
    );
  }
}

export const Container = connect(mapStateToProps)(ContainerBase);
