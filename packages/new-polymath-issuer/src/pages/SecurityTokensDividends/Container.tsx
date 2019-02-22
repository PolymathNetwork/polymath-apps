import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ActionType } from 'typesafe-actions/dist/types';
import { types } from '@polymathnetwork/new-shared';
import { Presenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { createErc20DividendsModuleBySymbolFetcher } from '~/state/fetchers';
import {
  enableErc20DividendsModuleStart,
  createCheckpointStart,
} from '~/state/actions/procedures';

const actions = {
  enableErc20DividendsModuleStart,
  createCheckpointStart,
};

export interface Props {
  dispatch: Dispatch<ActionType<typeof actions>>;
  securityTokenSymbol: string;
}

export class ContainerBase extends Component<Props> {
  public enableErc20DividendsModule = () => {
    const { dispatch, securityTokenSymbol } = this.props;

    // TODO @monitz87: change the wallet address to the one supplied by the user when we implement the form
    dispatch(
      enableErc20DividendsModuleStart({
        securityTokenSymbol,
        storageWalletAddress: '0xf17f52151EbEF6C7334FAD080c5704D77216b732',
      })
    );
  };
  public createCheckpoint = () => {
    const { dispatch, securityTokenSymbol } = this.props;

    dispatch(createCheckpointStart({ securityTokenSymbol }));
  };
  public render() {
    const { securityTokenSymbol } = this.props;
    return (
      <DataFetcher
        fetchers={[
          createErc20DividendsModuleBySymbolFetcher({ securityTokenSymbol }),
        ]}
        render={(data: {
          erc20DividendsModules: types.Erc20DividendsModuleEntity[];
        }) => {
          const {
            erc20DividendsModules: [erc20DividendsModule],
          } = data;

          return (
            <Presenter
              onCreateCheckpoint={this.createCheckpoint}
              onEnableDividends={this.enableErc20DividendsModule}
              dividendsModule={erc20DividendsModule}
            />
          );
        }}
      />
    );
  }
}

export const Container = connect()(ContainerBase);
