import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Presenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { createTaxWithholdingListBySymbolFetcher } from '~/state/fetchers';
import { types } from '@polymathnetwork/new-shared';

export interface Props {
  dispatch: Dispatch<any>;
  symbol: string;
  checkpointIndex: number;
}

export class ContainerBase extends Component<Props> {
  public render() {
    const { symbol } = this.props;
    return (
      <DataFetcher
        fetchers={[
          createTaxWithholdingListBySymbolFetcher({
            securityTokenSymbol: symbol,
          }),
        ]}
        render={({
          taxWithholdings,
        }: {
          taxWithholdings: types.TaxWithholdingEntity[];
        }) => {
          return <Presenter />;
        }}
      />
    );
  }
}

export const Container = connect()(ContainerBase);
