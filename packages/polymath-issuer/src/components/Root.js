// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isMobile, isChrome, isFirefox, isOpera } from 'react-device-detect';
import { Loading } from 'carbon-components-react';
import { renderRoutes } from 'react-router-config';
import { hot } from 'react-hot-loader';
import type { RouterHistory } from 'react-router-dom';
import {
  MetamaskStatus,
  NotSupportedPage,
  ErrorBoundary,
  EthNetworkWrapper,
  setupHistory,
} from '@polymathnetwork/ui';
import {
  MAINNET_NETWORK_ID,
  KOVAN_NETWORK_ID,
} from '@polymathnetwork/shared/constants';

import SplashPage from './SplashPage';

type StateProps = {|
  isNotice: boolean,
  location: Object,
|};

type DispatchProps = {|
  setupHistory: (history: RouterHistory) => any,
|};

const mapStateToProps = (state): StateProps => ({
  isNotice: state.pui.notice.isOpen,
  location: state.router.location,
});

const mapDispatchToProps: DispatchProps = {
  setupHistory,
};

type Props = {|
  routes: Object,
  history: Object,
|} & StateProps &
  DispatchProps;

class Root extends Component<Props> {
  componentDidMount() {
    this.props.setupHistory(this.props.history);
  }

  render() {
    const { isNotice, routes, location } = this.props;
    const isUnsupportedBrowser = !isChrome && !isFirefox && !isOpera;
    const networks = [MAINNET_NETWORK_ID, KOVAN_NETWORK_ID];

    return (
      <ErrorBoundary>
        <div className={'bx--grid' + (isNotice ? ' pui-grid-notice' : '')}>
          {isMobile || isUnsupportedBrowser ? (
            <NotSupportedPage />
          ) : location.pathname === '/' ? (
            <SplashPage />
          ) : (
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
              {renderRoutes(routes)}
            </EthNetworkWrapper>
          )}
        </div>
      </ErrorBoundary>
    );
  }
}

export default hot(module)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Root)
);
