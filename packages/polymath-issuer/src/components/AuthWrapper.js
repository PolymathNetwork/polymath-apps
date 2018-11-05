// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  signIn,
  txHash,
  txEnd,
  getNotice,
  SignInPage,
  SignUpPage,
  SignUpSuccessPage,
} from '@polymathnetwork/ui';

import { tickerReservationEmail } from '../actions/ticker';
import ConfirmEmailPage from './ConfirmEmailPage';
import MigrateTokenPage from './MigrateTokenPage';

import type { RootState } from '../redux/reducer';

type StateProps = {|
  network: any,
  isSignedIn: ?boolean,
  isSignedUp: ?boolean,
  isTickerReserved: ?boolean,
  isEmailConfirmed: ?boolean,
  isSignUpSuccess: boolean,
  hasLegacyTokens: ?boolean,
|};

type DispatchProps = {|
  txHash: (hash: string) => any,
  txEnd: (receipt: any) => any,
  signIn: () => any,
  getNotice: (scope: string) => any,
  tickerReservationEmail: () => any,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  network: state.network,
  isSignedIn: state.pui.account.isSignedIn,
  isSignedUp: state.pui.account.isSignedUp,
  isTickerReserved: state.ticker.isTickerReserved,
  isEmailConfirmed: state.pui.account.isEmailConfirmed,
  isSignUpSuccess: state.pui.account.isEnterPINSuccess,
  hasLegacyTokens: state.ticker.hasLegacyTokens,
});

const mapDispatchToProps: DispatchProps = {
  txHash,
  txEnd,
  signIn,
  getNotice,
  tickerReservationEmail,
};

type Props = {|
  children: Object,
  onFail: () => any,
|} & StateProps &
  DispatchProps;

class AuthWrapper extends Component<Props> {
  handleSignUpSuccess = () => {
    this.props.tickerReservationEmail();
  };

  // TODO @grsmto: Refactor the auth process so we don't have to use this hack.
  // Ideally we should check for user authorisations at route level instead of
  // doing this at the view level independently from the current URL/route.
  componentDidUpdate(prevProps) {
    const { isSignedIn, isSignedUp } = this.props;

    if (!prevProps.isSignedIn && isSignedIn && !isSignedUp) {
      this.props.onFail();
    }
  }

  render() {
    const {
      isSignedIn,
      isSignedUp,
      isEmailConfirmed,
      isSignUpSuccess,
      children,
      hasLegacyTokens,
    } = this.props;

    return !isSignedIn ? (
      <SignInPage />
    ) : !isSignedUp ? (
      <SignUpPage />
    ) : !isEmailConfirmed ? (
      isSignUpSuccess ? (
        <SignUpSuccessPage
          text={
            <span>
              You are now ready to continue with your Security Token.
              <br />
              We just sent you an email with the token symbol reservation
              transaction details for your records. Check your inbox.
            </span>
          }
          continueLabel="CONTINUE WITH TOKEN CREATION"
          onWillMount={this.handleSignUpSuccess}
        />
      ) : (
        <ConfirmEmailPage />
      )
    ) : hasLegacyTokens ? (
      <MigrateTokenPage />
    ) : (
      children
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthWrapper);
