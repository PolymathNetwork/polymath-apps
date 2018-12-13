import React, { Component, ReactChildren, ReactNode } from 'react';
import { getBrowserSupport, BrowserSupport } from '@polymathnetwork/sdk';
import { Redirect } from '@reach/router';

interface Props {
  redirectTo: string;
  render: () => ReactNode;
}

export class RequireEthereumSupport extends Component<Props> {
  public static defaultProps = {
    redirectTo: '/metamask',
  };

  public render() {
    const { redirectTo } = this.props;
    if (getBrowserSupport() === BrowserSupport.None) {
      return <Redirect to={redirectTo} noThrow />;
    }

    return this.props.render();
  }
}
