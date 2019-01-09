import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Presenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { createErc20DividendsModuleBySymbolFetcher } from '~/state/fetchers';
import { Erc20DividendsModuleEntity } from '~/types';

export interface Props {
  dispatch: Dispatch<any>;
  securityTokenSymbol: string;
}

export class ContainerBase extends Component<Props> {
  public enableErc20DividendsModule() {}
  public createCheckpoint() {}
  public render() {
    const { securityTokenSymbol } = this.props;
    return (
      <DataFetcher
        fetchers={[
          createErc20DividendsModuleBySymbolFetcher({ securityTokenSymbol }),
        ]}
        render={(data: {
          erc20DividendsModules: Erc20DividendsModuleEntity[];
        }) => {
          const {
            erc20DividendsModules: [erc20DividendsModule],
          } = data;

          // TODO @monitz87: pass actual props to presenter when it is implemented
          return <Presenter />;
        }}
      />
    );
  }
}

export const Container = connect()(ContainerBase);
