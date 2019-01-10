import { polyClient } from '~/lib/polymath';
import React, { Component } from 'react';
import { browserUtils } from '@polymathnetwork/sdk';

class Container extends Component {
  public async componentDidMount() {
    await browserUtils.getCurrentAddress();

    console.log('Connecting');
    await polyClient.connect();

    console.log('Connected');
    const transactionQueue = await polyClient.reserveSecurityToken({
      name: 'FOOKEN',
      symbol: 'FOOKEN',
    });

    console.log('transactionQueue', transactionQueue);

    console.log('About to run');

    transactionQueue.onStatusChange(({ status }) => {
      console.log('Status updated for transactionQueue:', status);
    });

    transactionQueue.onTransactionStatusChange(({ status, tag }, seq) => {
      console.log(`Transaction[${tag}]: Status update => ${status}`);
    });

    try {
      await transactionQueue.run();
    } catch (err) {
      console.log('Aug', err.code);
    }

    console.log('Finished fetch');
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
