import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ActionType } from 'typesafe-actions';
import { types, constants } from '@polymathnetwork/new-shared';
import { Page } from '@polymathnetwork/new-ui';
import { Presenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import {
  createTaxWithholdingListBySymbolFetcher,
  createDividendBySymbolAndIdFetcher,
} from '~/state/fetchers';
import { RootState } from '~/state/store';
import { getSession, getApp } from '~/state/selectors';
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
  securityTokenSymbol: string;
  dividendIndex: string;
  networkId?: number;
}

const mapStateToProps = (state: RootState) => {
  const { networkId } = getApp(state);
  return { networkId };
};

export class ContainerBase extends Component<Props> {
  public pushDividendPayments = () => {
    const { dispatch, securityTokenSymbol, dividendIndex } = this.props;

    dispatch(
      pushDividendPaymentStart({
        securityTokenSymbol,
        dividendType: DividendModuleTypes.Erc20,
        dividendIndex: parseInt(dividendIndex, 10),
      })
    );
  };
  public withdrawTaxes = () => {
    const { dispatch, securityTokenSymbol, dividendIndex } = this.props;

    dispatch(
      withdrawDividendTaxesStart({
        securityTokenSymbol,
        dividendType: DividendModuleTypes.Erc20,
        dividendIndex: parseInt(dividendIndex, 10),
      })
    );
  };

  public render() {
    const { securityTokenSymbol, dividendIndex, networkId } = this.props;
    const subdomain = networkId ? constants.EtherscanSubdomains[networkId] : '';
    return (
      <Page title="Dividend Details">
        <DataFetcher
          fetchers={[
            createTaxWithholdingListBySymbolFetcher({
              securityTokenSymbol,
              dividendType: DividendModuleTypes.Erc20,
            }),
            createDividendBySymbolAndIdFetcher({
              securityTokenSymbol,
              dividendType: DividendModuleTypes.Erc20,
              dividendIndex: parseInt(dividendIndex, 10),
            }),
          ]}
          render={(data: {
            taxWithholdings: types.TaxWithholdingEntity[];
            dividends: types.DividendEntity[];
          }) => {
            const {
              taxWithholdings,
              dividends: [dividend],
            } = data;

            return (
              <Presenter
                subdomain={subdomain}
                symbol={securityTokenSymbol}
                dividend={dividend}
                taxWithholdings={taxWithholdings}
                pushDividendPayments={this.pushDividendPayments}
                withdrawTaxes={this.withdrawTaxes}
              />
            );
          }}
        />
      </Page>
    );
  }
}

export const Container = connect(mapStateToProps)(ContainerBase);
