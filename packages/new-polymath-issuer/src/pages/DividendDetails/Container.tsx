import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ActionType } from 'typesafe-actions/dist/types';
import { types } from '@polymathnetwork/new-shared';
import { Page } from '@polymathnetwork/new-ui';
import { Presenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import {
  createTaxWithholdingListBySymbolFetcher,
  createDividendBySymbolAndIdFetcher,
} from '~/state/fetchers';
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
}

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
    const { securityTokenSymbol, dividendIndex } = this.props;
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
                symbol={securityTokenSymbol}
                dividend={dividend}
                taxWithholdings={taxWithholdings}
              />
            );
          }}
        />
      </Page>
    );
  }
}

export const Container = connect()(ContainerBase);
