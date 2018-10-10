// @flow

// eslint-disable-next-line
import React, { Component } from 'react';
import { connect } from 'react-redux';
import canUseDOM from 'can-use-dom';

import type { Node } from 'react';

import { init } from './actions';

type StateProps = {|
  isConnected: boolean,
  isFailed: boolean,
  error: ?number,
|};

type DispatchProps = {|
  init: (networks: Array<string>) => any,
|};

const mapStateToProps = (state): StateProps => ({
  isConnected: state.network.isConnected,
  isFailed: state.network.isFailed,
  error: state.network.error,
});

const mapDispatchToProps: DispatchProps = {
  init,
};

type Props = {|
  children: Node,
  loading: Node,
  guide: Node,
  networks: Array<string>,
|} & StateProps &
  DispatchProps;

class EthNetworkWrapper extends Component<Props> {
  init = () => {
    this.props.init(this.props.networks);
  };

  componentWillMount() {
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

  render() {
    if (this.props.isConnected) {
      return this.props.children;
    }
    if (!this.props.isFailed) {
      return this.props.loading;
    }
    return this.props.guide;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EthNetworkWrapper);
