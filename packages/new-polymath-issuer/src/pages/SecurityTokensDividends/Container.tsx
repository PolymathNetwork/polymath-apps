import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ActionType } from 'typesafe-actions/dist/types';
import { types, constants } from '@polymathnetwork/new-shared';
import { Page } from '@polymathnetwork/new-ui';
import { Presenter } from './Presenter';
import { DataFetcher } from '~/components/enhancers/DataFetcher';
import { createErc20DividendsModuleBySymbolFetcher } from '~/state/fetchers';
import {
  enableErc20DividendsModuleStart,
  createCheckpointStart,
  setDividendsWalletStart,
} from '~/state/actions/procedures';
import { RootState } from '~/state/store';
import { getSession, getApp } from '~/state/selectors';
import { DividendModuleTypes } from '@polymathnetwork/sdk';

const actions = {
  enableErc20DividendsModuleStart,
  createCheckpointStart,
  setDividendsWalletStart,
};

export interface Props {
  dispatch: Dispatch<ActionType<typeof actions>>;
  securityTokenSymbol: string;
  walletAddress: string;
  networkId?: number;
}

const mapStateToProps = (state: RootState) => {
  const { wallet } = getSession(state);
  const { networkId } = getApp(state);
  let walletAddress = '';

  if (wallet) {
    walletAddress = wallet.address;
  }

  return { walletAddress, networkId };
};

export class ContainerBase extends Component<Props> {
  public enableErc20DividendsModule = (storageWalletAddress: string) => {
    const { dispatch, securityTokenSymbol } = this.props;

    dispatch(
      enableErc20DividendsModuleStart({
        securityTokenSymbol,
        storageWalletAddress,
      })
    );
  };

  public changeWalletAddress = (storageWalletAddress: string) => {
    const { dispatch, securityTokenSymbol } = this.props;

    dispatch(
      setDividendsWalletStart({
        securityTokenSymbol,
        dividendType: DividendModuleTypes.Erc20,
        walletAddress: storageWalletAddress,
      })
    );
  };

  public createCheckpoint = () => {
    const { dispatch, securityTokenSymbol } = this.props;

    dispatch(createCheckpointStart({ securityTokenSymbol }));
  };

  public render() {
    const { securityTokenSymbol, walletAddress, networkId } = this.props;

    const subdomain = networkId ? constants.EtherscanSubdomains[networkId] : '';

    return (
      <Page title="Dividends">
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
                subdomain={subdomain}
                onCreateCheckpoint={this.createCheckpoint}
                onEnableDividends={this.enableErc20DividendsModule}
                onChangeWalletAddress={this.changeWalletAddress}
                dividendsModule={erc20DividendsModule}
                defaultWalletAddress={
                  erc20DividendsModule
                    ? erc20DividendsModule.storageWalletAddress
                    : walletAddress
                }
              />
            );
          }}
        />
      </Page>
    );
  }
}

export const Container = connect(mapStateToProps)(ContainerBase);
