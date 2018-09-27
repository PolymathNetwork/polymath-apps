// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { formValueSelector } from 'redux-form';
import { bull } from '@polymathnetwork/ui';

import SignUpForm, { formName } from './SignUpForm';
import { signUp } from '../redux/account/actions';

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
      <DocumentTitle title="Sign Up – Polymath">
        <div className="pui-single-box">
          <div className="pui-single-box-header">
            <div className="pui-single-box-bull">
              <img src={bull} alt="Bull" />
            </div>
            <h1 className="pui-h1">Create Your Account</h1>
            <h3 className="pui-h3">
              Start your private environment to select your Token symbol, create
              your Token, plan and execute your Security Token Offering.
            </h3>
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
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpPage);
