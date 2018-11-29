// @flow

import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Button } from 'carbon-components-react';

import keyImg from '../../images/key.png';

import { signIn } from '../../redux/account/actions';
import type { RootState } from '../../redux/reducer';

import Remark from '../Remark';
import Heading from '../Heading';
import Box from '../Box';
import PageCentered from '../PageCentered';
import ContentBox from '../ContentBox';

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

export class SignInPage extends PureComponent<Props> {
  handleSign = () => {
    this.props.signIn();
  };

  render() {
    const pageId = this.props.isSignInCancelled ? 'sign-in-failed' : 'sign-in';

    const ico = (
      <Box textAlign="center" mb={3}>
        <img src={keyImg} alt="Key" />
      </Box>
    );
    const desc = (
      <span>
        Once you have digitally signed the verification code with your MetaMask
        wallet, your wallet will allow you to single-sign into your Polymath
        account without the need for a dedicated username and password
        combination.
      </span>
    );

    return (
      <PageCentered title="Sign In – Polymath" id={pageId}>
        <ContentBox maxWidth={735}>
          {ico}
          {this.props.isSignInCancelled ? (
            <Fragment>
              <Heading variant="h2" textAlign="center">
                Digital Signature Failed.
                <br />
                Please Sign Using Your Wallet
              </Heading>
              <Heading as="h3" variant="h4" textAlign="center">
                {desc} To proceed with the signing operation, please click on
                &laquo;SIGN YOUR ACCOUNT&raquo;.
              </Heading>
              <br />
              <Remark title="Note">
                This signing operation is not associated with any cost.
              </Remark>
              <Box textAlign="center">
                <Button onClick={this.handleSign}>Sign your account</Button>
              </Box>
            </Fragment>
          ) : (
            <Fragment>
              <Heading variant="h2" textAlign="center">
                Sign In with Your Wallet
              </Heading>
              <Heading as="h3" variant="h4" textAlign="center">
                {desc} This signing operation has no cost associated and can be
                completed by clicking on the &laquo;SIGN&raquo; button in your
                MetaMask.
              </Heading>
              <br />
              <Remark title="Note">
                If MetaMask does not open automatically, please check that the
                browser extension does not have an outstanding request by
                clicking on its icon.
              </Remark>
            </Fragment>
          )}
        </ContentBox>
      </PageCentered>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInPage);
