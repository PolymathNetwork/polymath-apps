import React, { Component } from 'react';
import { client } from '~/lib/polymathClient';
import { RouteComponentProps } from '@reach/router';

export class SdkTestPage extends Component<RouteComponentProps> {
  public async componentDidMount() {
    const transactions = await client.reserveSecurityToken({
      symbol: 'FOO',
      name: 'FooToken',
    });
    console.log('transactions', transactions);
  }
  public render() {
    return <div>loading...</div>;
  }
}
