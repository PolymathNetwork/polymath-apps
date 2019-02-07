import { connect } from 'react-redux';
import React, { Component, Dispatch } from 'react';
import { browserUtils } from '@polymathnetwork/sdk';
import { Page, Button } from '@polymathnetwork/new-ui';
import { enableErc20DividendsModuleStart } from '~/state/actions/procedures';
import { ActionType } from 'typesafe-actions';
import { NETWORK } from '~/constants';
import { polyClient } from '~/lib/polyClient';

// tslint:disable no-console

export interface DispatchProps {
  dispatch: Dispatch<ActionType<typeof enableErc20DividendsModuleStart>>;
}

type Props = DispatchProps;

export class ContainerBase extends Component<Props> {
  public state = {
    ready: false,
  };
  public async componentDidMount() {
    const support = browserUtils.getBrowserSupport();

    if (support === browserUtils.BrowserSupport.None) {
      throw new Error('Metamask is not installed.');
    }
    if (support === browserUtils.BrowserSupport.Modern) {
      // We use this to prompt the user to enable Metamask if required
      // in the real flow we check wether this throws or not, to show the
      // user a dialog so that they can try enabling again
      await browserUtils.getCurrentAddress();
    }

    console.log(`Browser support detected: ${support}`);

    const networkId = await browserUtils.getNetworkId();

    console.log(`Network id detected: ${networkId}`);

    if (!networkId) {
      throw new Error('Unable to retrieve networkId.');
    }

    const params = NETWORK.POLY_CLIENT_PARAMS[networkId];

    console.log(`Network params used: ${JSON.stringify(params)}`);

    await polyClient.connect(params);

    console.log(`Polymath client connected.`);

    // Here you can use the polyClient

    // NOTE: That most of the interactions in the SDK are not yet implemented

    // Check `procedures` in the polymath-sdk package. Most of the procedures
    // that are implemented there are complete, though watchout, some might
    // be only partially done.

    // Example reserving a symbol
    const transactionQueue = await polyClient.reserveSecurityToken({
      name: 'Some token',
      symbol: 'STTOKEN',
    });

    // We have a transaction queue modal that shows the process, but
    // since this is a fully isolated example you wont be able to use it.

    // Transactions will pop up as they are required, the promise will resolve
    // once all transactions are finished.
    //
    // WARNING: There is a bug at this point where metamask-approved transactions
    // that throw a contract error are marked as succeeded even though they
    // failed. This means reverts are not being catched yet. Throwing an
    // error if the dryRun fails on lowLevel would correct this.
    //
    // you can listen to specific transaction events
    // e.g: transactionQueue.
    //
    // console.log(
    //   `Starting transactions for procedure type: ${
    //     transactionQueue.procedureType
    //   }`
    // );

    // transactionQueue.onStatusChange(queue => {
    //   console.log(`Queue status: ${queue.status}`);
    // });
    // transactionQueue.onTransactionStatusChange(tx => {
    //   console.log(`Transaction status: ${tx.status}`);
    // });

    // try {
    //   await transactionQueue.run();
    // } catch (err) {
    //   console.error(err);
    // }
  }

  public render() {
    return <Page title="Temp Page">Open the console</Page>;
  }
}

export const TempPage = connect()(ContainerBase);
