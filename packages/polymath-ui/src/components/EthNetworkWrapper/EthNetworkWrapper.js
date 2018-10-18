// @flow

// eslint-disable-next-line
import React, { Component } from 'react';
import { connect } from 'react-redux';
import canUseDOM from 'can-use-dom';

import type { Node } from 'react';

import { init, requestAuthorization } from './actions';

type StateProps = {|
  isConnected: boolean,
  isFailed: boolean,
  error: ?number,
|};

type DispatchProps = {|
  init: (networks: Array<string>) => any,
  requestAuthorization: () => any,
|};

const mapStateToProps = (state): StateProps => ({
  isConnected: state.network.isConnected,
  isFailed: state.network.isFailed,
  error: state.network.error,
});

const mapDispatchToProps: DispatchProps = {
  init,
  requestAuthorization,
};

type Props = {|
  children: Node,
  Loading: Node,
  errorRender: Function,
  networks: Array<string>,
|} & StateProps &
  DispatchProps;

export class EthNetworkWrapper extends Component<Props> {
  componentDidMount() {
    if (!this.props.isConnected && !this.props.isFailed) {
      if (canUseDOM) {
        if (document.readyState === 'complete') {
          this.init();
        } else {
          window.addEventListener('load', () => {
            this.init();
          });
        }
      }
    }
  }

  init = () => {
    this.props.init(this.props.networks);
  };

  handleAuthRequest() {
    this.props.requestAuthorization();
  }

  render() {
    const {
      isConnected,
      isFailed,
      Loading,
      errorRender,
      error,
      children,
    } = this.props;

    if (isFailed) {
      return errorRender({
        networkError: error,
        onRequestAuth: this.handleAuthRequest.bind(this),
      });
    }
    if (!isConnected) {
      return Loading;
    }
    return children;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EthNetworkWrapper);
