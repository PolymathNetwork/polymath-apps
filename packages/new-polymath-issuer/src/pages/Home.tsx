import { polyClient } from '~/lib/polymath';
import React, { Component } from 'react';
import { browserUtils } from '@polymathnetwork/sdk';

class Container extends Component {
  public async componentDidMount() {
    await browserUtils.getCurrentAddress();
    await polyClient.connect();
    const transactionQueue = await polyClient.reserveSecurityToken({
      name: 'FOOKEN',
      symbol: 'FOOKEN',
    });

    console.log('transactionQueue', transactionQueue);

    transactionQueue.onStatusChange(({ status }) => {
      console.debug('Status updated for transactionQueue:', status);
    });

    transactionQueue.onTransactionStatusChange(({ status, tag }, seq) => {
      console.debug(`Transaction[${tag}]: Status update => ${status}`);
    });

    try {
      await transactionQueue.run();
    } catch (err) {
      console.debug('Error', err.code);
    }
  }

  public render() {
    return <div>hi</div>;
  }
}

export const HomePage = () => (
  <div>
    <Container />
  </div>
);
