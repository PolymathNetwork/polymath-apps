import { polyClient } from '~/lib/polymath';
import React, { Component } from 'react';
import { browserUtils } from '@polymathnetwork/sdk';

class Container extends Component {
  public async componentDidMount() {
    await browserUtils.getCurrentAddress();

    console.log('Connecting');
    await polyClient.connect();

    console.log('Connected');
    const sequence = await polyClient.reserveSecurityToken({
      name: 'FOOKEN',
      symbol: 'FOOKEN',
    });

    console.log('sequence', sequence);

    console.log('About to run');

    sequence.onStatusChange(({ status }) => {
      console.log('Status updated for sequence:', status);
    });

    sequence.onTransactionStatusChange(({ status, tag }, seq) => {
      console.log(`Transaction[${tag}]: Status update => ${status}`);
    });

    try {
      await sequence.run();
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
