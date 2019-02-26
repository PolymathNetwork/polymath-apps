import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Presenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { types, formatters, utils } from '@polymathnetwork/new-shared';
import { Page } from '@polymathnetwork/new-ui';
import { DateTime } from 'luxon';
import { ActionType } from 'typesafe-actions';
import { DividendModuleTypes } from '@polymathnetwork/sdk';

const actions = {};

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
        <Presenter />
      </Page>
    );
  }
}

export const Container = connect()(ContainerBase);
