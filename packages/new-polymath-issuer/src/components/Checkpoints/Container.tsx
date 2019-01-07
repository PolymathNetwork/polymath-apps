import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Presenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { createCheckpointsBySymbolFetcher } from '~/state/fetchers';

export interface Props {
  dispatch: Dispatch<any>;
  symbol: string;
}

const mapStateToProps = () => {};

export class ContainerBase extends Component<Props> {
  public render() {
    const { symbol } = this.props;
    return (
      <DataFetcher
        fetchers={[
          createCheckpointsBySymbolFetcher({
            securityTokenSymbol: symbol,
          }),
        ]}
        render={data => {
          const { checkpoints } = data;
          console.log(data);

          return <Presenter />;
        }}
      />
    );
  }
}

export const Container = connect()(ContainerBase);
