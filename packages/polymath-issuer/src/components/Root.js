// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { isMobile, isChrome, isFirefox, isOpera } from 'react-device-detect';
import { Loading } from 'carbon-components-react';
import { renderRoutes } from 'react-router-config';
import { hot } from 'react-hot-loader';
import type { RouterHistory } from 'react-router-dom';
import Modal from 'react-modal';
import {
  NotSupportedPage,
  MaintenancePage,
  ErrorBoundary,
  setupHistory,
  EthNetworkWrapper,
  MetamaskStatus,
  StickyTop,
  Header,
  Footer,
  NoticeBar,
} from '@polymathnetwork/ui';
import {
  MAINNET_NETWORK_ID,
  KOVAN_NETWORK_ID,
} from '@polymathnetwork/shared/constants';

import HomePage from '../pages/home';

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
    const { routes, location } = this.props;
    const isUnsupportedBrowser = !isChrome && !isFirefox && !isOpera;
    const networks = [MAINNET_NETWORK_ID, KOVAN_NETWORK_ID];

    // FIXME @RafaelVidaurre: Remove this hack, only used for temporary maintenance mode
    if (window.location.pathname === '/maintenance') {
      return <MaintenancePage />;
    }
    return (
      <ErrorBoundary>
        {isMobile || isUnsupportedBrowser ? (
          <NotSupportedPage />
        ) : location.pathname === '/' ? (
          <Fragment>
            <StickyTop zIndex={'header'}>
              <NoticeBar />
              <Header variant="transparent" />
            </StickyTop>
            <HomePage />
            <ModalTransactionQueue />
            <Footer variant="transparent" />
          </Fragment>
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
