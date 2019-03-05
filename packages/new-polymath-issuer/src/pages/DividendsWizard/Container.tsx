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
import { BigNumber } from 'bignumber.js';

const actions = {
  updateTaxWithholdingListStart,
  createErc20DividendDistributionStart,
};

export interface Props {
  dispatch: Dispatch<ActionType<typeof actions>>;
  securityTokenSymbol: string;
  checkpointIndex: number;
}

interface State {
  step: number;
}

interface Row {
  investorAddress: string;
  percentage: number;
}

export class ContainerBase extends Component<Props, State> {
  public state = {
    step: 1,
  };

  public nextStep = () => {
    const { step } = this.state;

    this.setState({
      step: step + 1,
    });
  };

  public createDividendDistribution = ({
    erc20Address,
    amount,
    name,
    excludedAddresses,
  }: {
    erc20Address: string;
    amount: BigNumber;
    name: string;
    excludedAddresses: string[];
  }) => {
    const { dispatch, securityTokenSymbol, checkpointIndex } = this.props;

    const maturityDate = new Date();
    const expiryDate = new Date(
      maturityDate.getFullYear() + 1000,
      maturityDate.getMonth(),
      maturityDate.getDate()
    );

    dispatch(
      createErc20DividendDistributionStart({
        securityTokenSymbol,
        maturityDate,
        expiryDate,
        erc20Address,
        amount,
        checkpointId: checkpointIndex,
        name,
        excludedAddresses,
        pushPaymentsWhenComplete: true,
      })
    );
  };

  public updateTaxWithholdingList = (
    taxWithholdings: types.TaxWithholdingPojo[]
  ) => {
    const { securityTokenSymbol, dispatch } = this.props;
    const investorAddresses: string[] = [];
    const percentages: number[] = [];

    taxWithholdings.forEach(({ investorAddress, percentage }) => {
      investorAddresses.push(investorAddress);
      percentages.push(percentage);
    });

    dispatch(
      updateTaxWithholdingListStart({
        securityTokenSymbol,
        dividendType: DividendModuleTypes.Erc20,
        investorAddresses,
        percentages,
      })
    );
  };

  public downloadTaxWithholdingList = (
    taxWithholdings: types.TaxWithholdingPojo[]
  ) => {
    const { securityTokenSymbol } = this.props;

    const data: Row[] = taxWithholdings.map(
      ({ percentage, investorAddress }) => ({
        investorAddress,
        percentage: percentage * 100,
      })
    );

    const fileName = `withholdings_${securityTokenSymbol.toUpperCase()}_${formatters.toDateFormat(
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
    const { securityTokenSymbol } = this.props;
    const { step } = this.state;
    return (
      <Page title="Create New Dividend Distribution">
        <DataFetcher
          fetchers={[
            createTaxWithholdingListBySymbolFetcher({
              securityTokenSymbol,
              dividendType: DividendModuleTypes.Erc20,
            }),
          ]}
          render={({
            taxWithholdings,
          }: {
            taxWithholdings: types.TaxWithholdingEntity[];
          }) => {
            return <Presenter stepIndex={step} onNextStep={this.nextStep} />;
          }}
        />
      </Page>
    );
  }
}

export const Container = connect()(ContainerBase);
