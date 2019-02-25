import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Presenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { createTaxWithholdingListBySymbolFetcher } from '~/state/fetchers';
import { types, formatters, utils } from '@polymathnetwork/new-shared';
import { Page } from '@polymathnetwork/new-ui';
import { DateTime } from 'luxon';
import {
  updateTaxWithholdingListStart,
  createErc20DividendDistributionStart,
} from '~/state/actions/procedures';
import { ActionType } from 'typesafe-actions';
import { DividendModuleTypes } from '@polymathnetwork/sdk';

const actions = {
  updateTaxWithholdingListStart,
  createErc20DividendDistributionStart,
};

export interface Props {
  dispatch: Dispatch<ActionType<typeof actions>>;
  symbol: string;
  checkpointIndex: number;
}

interface Row {
  investorAddress: string;
  percentage: number;
}

export class ContainerBase extends Component<Props> {
  public updateTaxWithholdingList = (
    taxWithholdings: types.TaxWithholdingPojo[]
  ) => {
    const { symbol, dispatch } = this.props;
    const investorAddresses: string[] = [];
    const percentages: number[] = [];

    taxWithholdings.forEach(({ investorAddress, percentage }) => {
      investorAddresses.push(investorAddress);
      percentages.push(percentage);
    });

    dispatch(
      updateTaxWithholdingListStart({
        securityTokenSymbol: symbol,
        dividendType: DividendModuleTypes.Erc20,
        investorAddresses,
        percentages,
      })
    );
  };

  public downloadTaxWithholdingList = (
    taxWithholdings: types.TaxWithholdingPojo[]
  ) => {
    const { symbol } = this.props;

    const data: Row[] = taxWithholdings.map(
      ({ percentage, investorAddress }) => ({
        investorAddress,
        percentage: percentage * 100,
      })
    );

    const fileName = `withholdings_${symbol.toUpperCase()}_${formatters.toDateFormat(
      new Date(),
      { format: DateTime.DATE_SHORT }
    )}`;

    utils.downloadCsvFile(data, fileName, {
      fields: [
        {
          label: 'Investor ETH Address',
          value: 'investorAddress',
        },
        {
          label: '% Tax Withholding',
          value: 'percentage',
        },
      ],
    });
  };

  public render() {
    const { symbol } = this.props;
    // return (
    // <DataFetcher
    //   fetchers={[
    //     createTaxWithholdingListBySymbolFetcher({
    //       securityTokenSymbol: symbol,
    //     }),
    //   ]}
    //   render={({
    //     taxWithholdings,
    //   }: {
    //     taxWithholdings: types.TaxWithholdingEntity[];
    //   }) => {
    //     return <Presenter />;
    //   }}
    // />
    // );
    return (
      <Page>
        <Presenter stepIndex={0} />
      </Page>
    );
  }
}

export const Container = connect()(ContainerBase);
