// @flow
import React, { Component, Fragment } from 'react';
import Contract from '@polymathnetwork/js';
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
  Navbar,
  Footer,
  EnterPINModal,
} from '@polymathnetwork/ui';

import { getMyTokens, getLegacyTokens } from '../actions/ticker';
import AuthWrapper from './AuthWrapper';

import type { RootState } from '../redux/reducer';

type StateProps = {|
  network: any,
  isSignedIn: ?boolean,
  isSignedUp: ?boolean,
  isFetching: boolean,
  isFetchingTokens: boolean,
  isTickerReserved: ?boolean,
  isEmailConfirmed: ?boolean,
  isSignUpSuccess: boolean,
  ticker: ?string,
|};

type DispatchProps = {|
  txHash: (hash: string) => any,
  txEnd: (receipt: any) => any,
  signIn: () => any,
  getMyTokens: () => any,
  getLegacyTokens: () => any,
  getNotice: (scope: string) => any,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  network: state.network,
  isSignedIn: state.pui.account.isSignedIn,
  isSignedUp: state.pui.account.isSignedUp,
  isFetching: state.pui.common.isFetching,
  isFetchingTokens: state.ticker.isFetchingTokens,
  isTickerReserved: state.ticker.isTickerReserved,
  isEmailConfirmed: state.pui.account.isEmailConfirmed,
  isSignUpSuccess: state.pui.account.isEnterPINSuccess,
  ticker: state.token.token ? state.token.token.ticker : null,
});

const mapDispatchToProps: DispatchProps = {
  txHash,
  txEnd,
  signIn,
  getMyTokens,
  getLegacyTokens,
  getNotice,
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
    this.props.signIn().then(() => {
      this.props.getLegacyTokens();
    });
  }

  onAuthFail() {
    // Make sure user is on the ticker page if he doesn't have an account yet
    if (this.props.location.pathname !== '/ticker') {
      this.props.history.push('/ticker');
    }
  }

  render() {
    const { ticker, isFetching, route, isFetchingTokens } = this.props;

    return (
      <Fragment>
        <Navbar ticker={ticker} />
        {isFetching || isFetchingTokens ? <Loading /> : ''}
        <Toaster />
        <TxModal />
        <EnterPINModal />
        <ConfirmModal />
        <AuthWrapper onFail={this.onAuthFail.bind(this)}>
          {renderRoutes(route.routes)}
        </AuthWrapper>
        <Footer />
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
