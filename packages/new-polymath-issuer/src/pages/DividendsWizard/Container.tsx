import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Presenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import {
  createTaxWithholdingListBySymbolAndCheckpointFetcher,
  createCheckpointBySymbolAndIdFetcher,
} from '~/state/fetchers';
import { types, formatters, utils } from '@polymathnetwork/new-shared';
import { DateTime } from 'luxon';
import {
  updateTaxWithholdingListStart,
  createErc20DividendDistributionStart,
} from '~/state/actions/procedures';
import { ActionType } from 'typesafe-actions';
import { DividendModuleTypes } from '@polymathnetwork/sdk';
import { BigNumber } from 'bignumber.js';
import { Page } from '@polymathnetwork/new-ui';
import { range, padStart } from 'lodash';
import { polyClient } from '~/lib/polyClient';
import { GetErc20BalanceByAddressAndWalletArgs } from '~/types';

const actions = {
  updateTaxWithholdingListStart,
  createErc20DividendDistributionStart,
};

export interface Props {
  dispatch: Dispatch<ActionType<typeof actions>>;
  securityTokenSymbol: string;
  checkpointIndex: string;
  createDividendDistribution: (
    params: CreateDividendDistributionParams
  ) => void;
}

interface State {
  step: number;
}

interface Row {
  investorAddress: string;
  percentage: number;
}

export interface CreateDividendDistributionParams {
  erc20Address: string;
  amount: BigNumber;
  name: string;
  excludedAddresses: string[];
}

export class ContainerBase extends Component<Props, State> {
  public state = {
    step: 0,
  };

  public nextStep = () => {
    const { step } = this.state;

    this.setState({
      step: step + 1,
    });
  };

  public previousStep = () => {
    const { step } = this.state;

    this.setState({
      step: step - 1,
    });
  };

  public fetchBalance = async ({
    tokenAddress,
    walletAddress,
  }: GetErc20BalanceByAddressAndWalletArgs): Promise<
    types.Erc20TokenBalancePojo
  > => {
    const tokenBalance = await polyClient.getErc20TokenBalance({
      tokenAddress,
      walletAddress,
    });

    return tokenBalance.toPojo();
  };

  public fetchIsValidToken = async ({
    tokenAddress,
  }: {
    tokenAddress: string;
  }) => {
    return polyClient.isValidErc20({ address: tokenAddress });
  };

  public createDividendDistribution = ({
    erc20Address,
    amount,
    name,
    excludedAddresses,
  }: CreateDividendDistributionParams) => {
    const { dispatch, securityTokenSymbol, checkpointIndex } = this.props;

    const parsedCheckpointIndex = parseInt(checkpointIndex, 10);

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
        checkpointIndex: parsedCheckpointIndex,
        name,
        excludedAddresses,
        pushPaymentsWhenComplete: true,
      })
    );
  };

  public updateTaxWithholdingList = (
    taxWithholdings: Array<{
      investorAddress: string;
      percentage: number;
    }>
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
    taxWithholdings: types.TaxWithholdingEntity[]
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

  public downloadSampleExclusionList() {
    const fileName = 'Sample-Exclusion-List.csv';

    utils.downloadCsvFile(
      range(10).map(i => ({
        investorAddress: `0x${padStart(`${i + 1}`, 40, '0')}`,
      })),
      fileName,
      {
        fields: [
          {
            label: 'Investor ETH Address',
            value: 'investorAddress',
          },
        ],
      }
    );
  }

  public render() {
    const { securityTokenSymbol, checkpointIndex } = this.props;
    const { step } = this.state;
    const parsedCheckpointIndex = parseInt(checkpointIndex, 10);
    return (
      <Page title="Create New Dividend Distribution">
        <DataFetcher
          watchProps={this.state}
          fetchers={[
            createTaxWithholdingListBySymbolAndCheckpointFetcher({
              securityTokenSymbol,
              checkpointIndex: parsedCheckpointIndex,
              dividendType: DividendModuleTypes.Erc20,
            }),
            createCheckpointBySymbolAndIdFetcher({
              securityTokenSymbol,
              checkpointIndex: parsedCheckpointIndex,
            }),
          ]}
          render={(
            {
              taxWithholdings,
              checkpoints: [checkpoint],
            }: {
              taxWithholdings: types.TaxWithholdingEntity[];
              checkpoints: types.CheckpointEntity[];
            },
            loading: boolean
          ) => {
            return (
              <Presenter
                createDividendDistribution={this.createDividendDistribution}
                updateTaxWithholdingList={this.updateTaxWithholdingList}
                stepIndex={step}
                securityTokenSymbol={securityTokenSymbol}
                checkpoint={checkpoint}
                onNextStep={this.nextStep}
                onPreviousStep={this.previousStep}
                taxWithholdings={taxWithholdings}
                downloadTaxWithholdingList={this.downloadTaxWithholdingList}
                downloadSampleExclusionList={this.downloadSampleExclusionList}
                fetchBalance={this.fetchBalance}
                fetchIsValidToken={this.fetchIsValidToken}
                isLoadingData={loading}
              />
            );
          }}
        />
      </Page>
    );
  }
}

export const Container = connect()(ContainerBase);
