// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { Button, Icon } from 'carbon-components-react';
import type { Node } from 'react';

import { emailConfirmed } from '../../redux/account/actions';

type DispatchProps = {|
  emailConfirmed: () => any,
|};

const mapDispatchToProps: DispatchProps = {
  emailConfirmed,
};

type Props = {|
  text: Node,
  continueLabel: string,
  onWillMount: () => any,
|} & DispatchProps;

class SignUpSuccessPage extends Component<Props> {
  componentWillMount() {
    this.props.onWillMount();
  }

  handleContinue = () => {
    this.props.emailConfirmed();
  };

  render() {
    return (
      <DocumentTitle title="Sign Up – Polymath">
        <div id="sign-up-success" className="pui-single-box">
          <p align="center" style={{ marginBottom: '15px', marginTop: '10px' }}>
            <Icon
              name="checkmark--outline"
              fill="#00AA5E"
              width="64"
              height="64"
            />
          </p>
          <h2 className="pui-h2" align="center">
            Successfully Verified Email and Your Account Is Activated
          </h2>
          <h3 className="pui-h3" align="center">
            {this.props.text}
          </h3>
          <br />
          <p align="center">
            <Button onClick={this.handleContinue}>
              {this.props.continueLabel}
            </Button>
          </p>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(SignUpSuccessPage);
