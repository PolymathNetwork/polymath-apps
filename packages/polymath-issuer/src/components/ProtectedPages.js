// @flow
import React, { Component } from 'react';
import { Loading } from 'carbon-components-react';
import { EthNetworkWrapper, MetamaskStatus } from '@polymathnetwork/ui';

import AuthWrapper from './AuthWrapper';

type Props = {|
  path: string,
  children: Node,
  networks: Array<string>,
|};

class ProtectedPages extends Component<Props> {
  onAuthFail = () => {
    // Make sure user is on the ticker page if he doesn't have an account yet
    if (this.props.location.pathname !== '/ticker') {
      this.props.navigate('/ticker');
    }
  };

  render() {
    const { networks, children } = this.props;

    return (
      <EthNetworkWrapper
        networks={networks}
        Loading={<Loading />}
        errorRender={({ networkError, onRequestAuth }) => (
          <MetamaskStatus
            networks="Mainnet, Kovan or Goerli"
            status={networkError}
            onRequestAuth={onRequestAuth}
          />
        )}
      >
        <AuthWrapper onFail={this.onAuthFail}>{children}</AuthWrapper>
      </EthNetworkWrapper>
    );
  }
}

export default ProtectedPages;
