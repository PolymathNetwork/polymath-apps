import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { types } from '@polymathnetwork/new-shared';
import { Presenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { createErc20DividendsModuleBySymbolFetcher } from '~/state/fetchers';
import { enableErc20DividendsModuleStart } from '~/state/actions/procedures';
import { ActionType } from 'typesafe-actions/dist/types';

export interface Props {
  dispatch: Dispatch<ActionType<typeof enableErc20DividendsModuleStart>>;
  securityTokenSymbol: string;
}

export class ContainerBase extends Component<Props> {
  public enableErc20DividendsModule() {
    const { dispatch, securityTokenSymbol } = this.props;

    dispatch(enableErc20DividendsModuleStart({ securityTokenSymbol }));
  }
  public createCheckpoint() {}
  public render() {
    const { securityTokenSymbol } = this.props;
    // return (
    //   <DataFetcher
    //     fetchers={[
    //       createErc20DividendsModuleBySymbolFetcher({ securityTokenSymbol }),
    //     ]}
    //     render={(data: {
    //       erc20DividendsModules: types.Erc20DividendsModuleEntity[];
    //     }) => {
    //       const {
    //         erc20DividendsModules: [erc20DividendsModule],
    //       } = data;

    //       // TODO @monitz87: pass actual props to presenter when it is implemented
    //       return <Presenter />;
    //     }}
    //   />
    // );
    return (
      <Presenter
        onEnableDividends={this.enableErc20DividendsModule}
        dividendsModule={{ contractAddress: '' }}
      />
    );
  }
}

export const Container = connect()(ContainerBase);
