// @flow
import React, { Component, Fragment } from 'react';
import { renderRoutes } from 'react-router-config';
import { connect } from 'react-redux';
import { Loading } from 'carbon-components-react';
import {
  signIn,
  txHash,
  txEnd,
  getNotice,
  Toaster,
  TxModal,
  ConfirmModal,
  NoticeBar,
  Header,
  Footer,
  EnterPINModal,
  StickyTop,
  notify,
} from '@polymathnetwork/ui';

import { getMyTokens } from '../actions/ticker';
import AuthWrapper from './AuthWrapper';

import type { RootState } from '../redux/reducer';

type StateProps = {|
  network: any,
  isSignedIn: ?boolean,
  isSignedUp: ?boolean,
  isFetching: boolean,
  isFetchingLegacyTokens: boolean,
  isTickerReserved: ?boolean,
  isEmailConfirmed: ?boolean,
  isSignUpSuccess: boolean,
  ticker: ?string,
  ui: any,
|};

type DispatchProps = {|
  txHash: (hash: string) => any,
  txEnd: (receipt: any) => any,
  signIn: () => any,
  getMyTokens: () => any,
  getNotice: (scope: string) => any,
  notify: (title: string, isSuccess: boolean, '', '', isPinned: boolean) => any,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  network: state.network,
  isSignedIn: state.pui.account.isSignedIn,
  isSignedUp: state.pui.account.isSignedUp,
  isFetching: state.pui.common.isFetching,
  isFetchingLegacyTokens: state.token.isFetchingLegacyTokens,
  isTickerReserved: state.ticker.isTickerReserved,
  isEmailConfirmed: state.pui.account.isEmailConfirmed,
  isSignUpSuccess: state.pui.account.isEnterPINSuccess,
  ticker: state.token.token ? state.token.token.ticker : null,
  ui: state.ui,
});

const mapDispatchToProps: DispatchProps = {
  txHash,
  txEnd,
  signIn,
  getMyTokens,
  getNotice,
  notify,
};

type Props = {|
  route: Object,
|} & StateProps &
  DispatchProps;

class App extends Component<Props> {
  componentWillMount() {
    this.props.getMyTokens();
    this.props.getNotice('issuers');
  }

  componentDidMount() {
    this.props.signIn();
    this.props.notify(
      'Polymath is performing a system upgrade to the ERC-1400 Security Token Standard on Monday, July 29th. Please expect the Token Studio to be offline.',
      false,
      '',
      '',
      true
    );
  }

  onAuthFail = () => {
    // Make sure user is on the ticker page if he doesn't have an account yet
    if (this.props.location.pathname !== '/ticker') {
      this.props.history.push('/ticker');
    }
  };

  render() {
    const {
      ticker,
      isFetching,
      ui,
      route,
      isFetchingLegacyTokens,
    } = this.props;

    return (
      <Fragment>
        {isFetching || isFetchingLegacyTokens ? <Loading /> : ''}
        <Toaster />
        <TxModal />
        <EnterPINModal />
        <ConfirmModal />
        <StickyTop zIndex={'header'}>
          <NoticeBar />
          <Header ticker={ticker} variant={ui.header.variant} />
        </StickyTop>
        <AuthWrapper onFail={this.onAuthFail}>
          {renderRoutes(route.routes)}
        </AuthWrapper>
        <Footer variant={ui.footer.variant} />
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
