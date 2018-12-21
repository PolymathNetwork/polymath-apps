import { polyClient } from '~/lib/polymath';
import React, { Component } from 'react';
import { browserUtils } from '@polymathnetwork/sdk';

class Container extends Component {
  public async componentDidMount() {
    await browserUtils.getCurrentAddress();
    await polyClient.connect();
    const sequence = await polyClient.reserveSecurityToken({
      name: 'FOOKEN',
      symbol: 'FOOKEN',
    });

    console.log(sequence);
    await sequence.run();
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
