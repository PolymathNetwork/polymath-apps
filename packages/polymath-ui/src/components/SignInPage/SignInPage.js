// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { Button } from 'carbon-components-react';
import { Remark } from '@polymathnetwork/ui';
import key from '@polymathnetwork/ui/images/key.png';

import { signIn } from '../../redux/account/actions';
import type { RootState } from '../../redux/reducer';

type StateProps = {|
  isSignInCancelled: boolean,
|};

const mapStateToProps = (state: RootState) => ({
  isSignInCancelled: state.pui.account.isSignInCancelled,
});

type DispatchProps = {|
  signIn: () => any,
|};

const mapDispatchToProps: DispatchProps = {
  signIn,
};

type Props = StateProps & DispatchProps;

export class SignInPage extends Component<Props> {
  handleSign = () => {
    this.props.signIn();
  };

  render() {
    const ico = (
      <p align="center" style={{ marginBottom: '15px', marginTop: '10px' }}>
        <img src={key} alt="Key" />
      </p>
    );
    const desc = (
      <span>
        Once you have digitally signed the verification code with your MetaMask
        wallet, your wallet will allow you to single-sign into your Polymath
        account without the need for a dedicated username and password
        combination.
      </span>
    );

    if (this.props.isSignInCancelled) {
      return (
        <DocumentTitle title="Sign In – Polymath">
          <div id="sign-in-failed" className="pui-single-box">
            {ico}
            <h2
              className="pui-h2"
              align="center"
              style={{ lineHeight: '36px' }}
            >
              Digital Signature Failed.
              <br />
              Please Sign Using Your Wallet
            </h2>
            <h3 className="pui-h3" align="center">
              {desc} To proceed with the signing operation, please click on
              &laquo;SIGN YOUR ACCOUNT&raquo;.
            </h3>
            <br />
            <Remark title="Note">
              This signing operation is not associated with any cost.
            </Remark>
            <p align="center">
              <Button onClick={this.handleSign}>SIGN YOUR ACCOUNT</Button>
            </p>
          </div>
        </DocumentTitle>
      );
    }

    return (
      <DocumentTitle title="Sign In – Polymath">
        <div id="sign-in" className="pui-single-box">
          {ico}
          <h2 className="pui-h2" align="center">
            Sign In with Your Wallet
          </h2>
          <h3 className="pui-h3" align="center">
            {desc} This signing operation has no cost associated and can be
            completed by clicking on the &laquo;SIGN&raquo; button in your
            MetaMask.
          </h3>
          <br />
          <Remark title="Note">
            If MetaMask does not open automatically, please check that the
            browser extension does not have an outstanding request by clicking
            on its icon.
          </Remark>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInPage);
