// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loading } from 'carbon-components-react';
import {
  EthNetworkWrapper,
  MetamaskStatus,
  signIn,
  getNotice,
} from '@polymathnetwork/ui';

import AuthWrapper from './AuthWrapper';

import { getMyTokens } from '../actions/ticker';

type Props = {|
  children: Node,
  networks: Array<string>,
|} & DispatchProps;

const mapDispatchToProps: DispatchProps = {
  signIn,
  getMyTokens,
  getNotice,
};

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
            networks="Mainnet or Kovan"
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

export default connect(
  null,
  mapDispatchToProps
)(ProtectedPages);
