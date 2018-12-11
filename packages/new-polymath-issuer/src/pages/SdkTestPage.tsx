import React, { Component } from 'react';
import { polyClient } from '~/lib/polyClient';
import { RouteComponentProps } from '@reach/router';

export class SdkTestPage extends Component<RouteComponentProps> {
  public async componentDidMount() {
    const transactionGroup = await polyClient.reserveSecurityToken({
      symbol: 'adwd',
      name: 'dwdw',
    });

    await transactionGroup.run();
  }
  public render() {
    return <div>loading...</div>;
  }
}
