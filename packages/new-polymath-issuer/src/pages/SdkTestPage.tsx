import React, { Component } from 'react';
import { client } from '~/lib/polymathClient';
import { RouteComponentProps } from '@reach/router';

export class SdkTestPage extends Component<RouteComponentProps> {
  public async componentDidMount() {
    const transactionGroup = await client.reserveSecurityToken({
      symbol: 'adwd',
      name: 'dwdw',
    });

    await transactionGroup.run();
  }
  public render() {
    return <div>loading...</div>;
  }
}
