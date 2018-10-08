// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isMobile, isChrome, isFirefox, isOpera } from 'react-device-detect';
import { Loading } from 'carbon-components-react';
import { hot } from 'react-hot-loader';
import {
  MetamaskStatus,
  NotSupportedPage,
  ErrorBoundary,
  EthNetworkWrapper,
  NETWORK_MAIN,
  NETWORK_KOVAN,
} from '@polymathnetwork/ui';

import type { Node } from 'react';

import App from './App';

// $FlowFixMe
import '../style.scss';

type StateProps = {|
  isNotice: boolean,
|};

const mapStateToProps = (state): StateProps => ({
  isNotice: state.pui.notice.isOpen,
});

type Props = {|
  routes?: Object,
  children: ?Node,
|} & StateProps;

class Root extends Component<Props> {
  render() {
    const { isNotice, routes } = this.props;
    const isUnsupportedBrowser = !isChrome && !isFirefox && !isOpera;
    const networks = [NETWORK_MAIN, NETWORK_KOVAN];

    return (
      <ErrorBoundary>
        <div className={'bx--grid' + (isNotice ? ' pui-grid-notice' : '')}>
          {isMobile || isUnsupportedBrowser ? (
            <NotSupportedPage />
          ) : (
            <EthNetworkWrapper
              loading={<Loading />}
              guide={<MetamaskStatus networks="Mainnet or Kovan" />}
              networks={networks}
            >
              <App routes={routes} />
            </EthNetworkWrapper>
          )}
        </div>
      </ErrorBoundary>
    );
  }
}

export default connect(mapStateToProps)(Root);
