// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isMobile, isChrome, isFirefox, isOpera } from 'react-device-detect';
import { Router } from '@reach/router';
import { hot } from 'react-hot-loader';
import type { RouterHistory } from 'react-router-dom';
import Modal from 'react-modal';
import {
  NotSupportedPage,
  NotFoundPage,
  ErrorBoundary,
  setupHistory,
} from '@polymathnetwork/ui';
import {
  MAINNET_NETWORK_ID,
  KOVAN_NETWORK_ID,
} from '@polymathnetwork/shared/constants';

import App from '../components/App';
import ProtectedPages from '../components/ProtectedPages';
import HomePage from '../pages/home';
import TickerPage from '../pages/ticker/TickerPage';

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
    Modal.setAppElement('#root');

    this.props.setupHistory(this.props.history);
  }

  render() {
    const isUnsupportedBrowser = !isChrome && !isFirefox && !isOpera;
    const networks = [MAINNET_NETWORK_ID, KOVAN_NETWORK_ID];

    return (
      <ErrorBoundary>
        {isMobile || isUnsupportedBrowser ? (
          <NotSupportedPage />
        ) : (
          <App>
            <Router>
              <HomePage path="/" />
              <ProtectedPages path="/*" networks={networks}>
                <TickerPage path="ticker" />
              </ProtectedPages>
              <NotFoundPage default />
            </Router>
          </App>
        )}
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
