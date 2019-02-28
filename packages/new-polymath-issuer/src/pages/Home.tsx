import { connect } from 'react-redux';
import React, { Component, Dispatch } from 'react';
import { browserUtils } from '@polymathnetwork/sdk';
import { Page, Button, Loading } from '@polymathnetwork/new-ui';
import { polyClient } from '~/lib/polyClient';
import { ModalTransactionQueue } from '~/components';
import { enableErc20DividendsModuleStart } from '~/state/actions/procedures';
import { ActionType } from 'typesafe-actions';
import { NETWORK } from '~/constants';

export interface DispatchProps {
  dispatch: Dispatch<ActionType<typeof enableErc20DividendsModuleStart>>;
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

  public render() {
    return (
      <Page title="Home">
        <ModalTransactionQueue />
        {this.state.ready ? (
          <Button onClick={this.startEnableDividends}>
            Enable Dividends (Test)
          </Button>
        ) : (
          <Loading />
        )}
      </Page>
    );
  }
}

export const HomePage = connect()(ContainerBase);
