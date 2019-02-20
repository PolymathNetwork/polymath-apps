import { connect } from 'react-redux';
import React, { Component, Dispatch, Fragment } from 'react';
import { browserUtils } from '@polymathnetwork/sdk';
import { Page, Button, Loading } from '@polymathnetwork/new-ui';
import { polyClient } from '~/lib/polyClient';
import { ModalTransactionQueue } from '~/components';
import {
  enableErc20DividendsModuleStart,
  createCheckpointStart,
  createErc20DividendDistributionStart,
} from '~/state/actions/procedures';
import { ActionType } from 'typesafe-actions';
import { NETWORK } from '~/constants';
import BigNumber from 'bignumber.js';

const actions = {
  enableErc20DividendsModuleStart,
  createCheckpointStart,
  createErc20DividendDistributionStart,
};

export interface DispatchProps {
  dispatch: Dispatch<ActionType<typeof actions>>;
}

type Props = DispatchProps;

export class ContainerBase extends Component<Props> {
  public state = {
    ready: false,
  };
  public async componentDidMount() {
    const { dispatch } = this.props;
    const networkId = await browserUtils.getNetworkId();

    if (!networkId) {
      throw new Error('Couldnt obtain network id');
    }
    await browserUtils.getCurrentAddress();
    await polyClient.connect(NETWORK.POLY_CLIENT_PARAMS[networkId]);

    this.setState({ ready: true });

    // const transactionQueue = await polyClient.reserveSecurityToken({
    //   name: 'FOOKEN',
    //   symbol: 'FOOKEN',
    // });

    // console.log('transactionQueue', transactionQueue);

    // transactionQueue.onStatusChange(({ status }) => {
    //   console.debug('Status updated for transactionQueue:', status);
    // });

    // transactionQueue.onTransactionStatusChange(({ status, tag }, seq) => {
    //   console.debug(`Transaction[${tag}]: Status update => ${status}`);
    // });

    // try {
    //   await transactionQueue.run();
    // } catch (err) {
    //   console.debug('Error', err.code);
    // }
  }

  public startEnableDividends = () => {
    this.props.dispatch(
      enableErc20DividendsModuleStart({
        securityTokenSymbol: 'A0T0',
        storageWalletAddress: '0xf17f52151EbEF6C7334FAD080c5704D77216b732',
      })
    );
  };

  public startCreateCheckpoint = () => {
    this.props.dispatch(
      createCheckpointStart({
        securityTokenSymbol: 'A0T0',
      })
    );
  };

  public startCreateDividendDistribution = () => {
    this.props.dispatch(
      createErc20DividendDistributionStart({
        securityTokenSymbol: 'A0T0',
        maturityDate: new Date(),
        expiryDate: new Date('10/10/2025'),
        erc20Address: '0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0',
        name: 'My Dividend Distribution',
        amount: new BigNumber('10000'),
        checkpointId: 1,
        excludedAddresses: [],
        pushPaymentsWhenComplete: true,
      })
    );
  };

  public render() {
    return (
      <Page title="Home">
        {this.state.ready ? (
          <Fragment>
            <Button onClick={this.startEnableDividends}>
              Enable Dividends (Test)
            </Button>
            <Button onClick={this.startCreateCheckpoint}>
              Create Checkpoint (Test)
            </Button>
            <Button onClick={this.startCreateDividendDistribution}>
              Create Distribution (Test)
            </Button>
          </Fragment>
        ) : (
          <Loading />
        )}
      </Page>
    );
  }
}

export const HomePage = connect()(ContainerBase);
