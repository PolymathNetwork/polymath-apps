// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { bull } from '../../';

import PageCentered from '../PageCentered';
import ContentBox from '../ContentBox';
import Heading from '../Heading';
import SignUpForm, { formName } from './SignUpForm';
import { signUp } from '../../redux/account/actions';

const formValue = formValueSelector(formName);

type StateProps = {|
  enableSubmit: boolean,
|};

const mapStateToProps = state => ({
  enableSubmit:
    !!formValue(state, 'acceptPrivacy') && !!formValue(state, 'acceptTerms'),
});

type DispatchProps = {|
  signUp: () => any,
|};

const mapDispatchToProps: DispatchProps = {
  signUp,
};

type Props = StateProps & DispatchProps;

class SignUpPage extends Component<Props> {
  handleSubmit = () => {
    this.props.signUp();
  };

  render() {
    return (
      <PageCentered title="Sign Up – Polymath" id="sign-up">
        <ContentBox maxWidth={735}>
          <div className="pui-single-box-header">
            <div className="pui-single-box-bull">
              <img src={bull} alt="Bull" />
            </div>
            <Heading as="h1" variant="h1">
              Create Your Account
            </Heading>
            <Heading variant="h4" mr={190}>
              Start your private environment to select your Token symbol,
              configure your Token, plan and execute your Security Token
              Offering.
            </Heading>
          </div>
          <SignUpForm
            onSubmit={this.handleSubmit}
            enableSubmit={this.props.enableSubmit}
          />
          <p className="pui-input-hint">
            Polymath collects information to understand how you interact with
            the Service and to make improvements.
            <br />
            <a
              href="https://www.fullstory.com/optout/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here to disable the collection of this information
            </a>
          </p>
        </ContentBox>
      </PageCentered>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpPage);
