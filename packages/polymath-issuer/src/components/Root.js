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
  NETWORK_MAIN,
  NETWORK_KOVAN,
} from '@polymathnetwork/ui';

import SplashPage from './SplashPage';

type StateProps = {|
  isNotice: boolean,
  location: Object,
  networkError: number,
|};

type DispatchProps = {|
  setupHistory: (history: RouterHistory) => any,
|};

const mapStateToProps = (state): StateProps => ({
  isNotice: state.pui.notice.isOpen,
  location: state.router.location,
  networkError: state.network.error,
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
    const { isNotice, routes, location, networkError } = this.props;
    const isUnsupportedBrowser = !isChrome && !isFirefox && !isOpera;
    const networks = [NETWORK_MAIN, NETWORK_KOVAN];

    return (
      <ErrorBoundary>
        <div className={'bx--grid' + (isNotice ? ' pui-grid-notice' : '')}>
          {isMobile || isUnsupportedBrowser ? (
            <NotSupportedPage />
          ) : location.pathname === '/' ? (
            <SplashPage />
          ) : (
            <EthNetworkWrapper
              loading={<Loading />}
              guide={
                <MetamaskStatus
                  networks="Mainnet or Kovan"
                  status={networkError}
                />
              }
              networks={networks}
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
