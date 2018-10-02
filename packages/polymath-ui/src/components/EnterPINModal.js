// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { Modal } from 'carbon-components-react';

import { cancelConfirmEmail, confirmEmail } from '../redux/account/actions';
import EnterPINForm, { formName } from './EnterPINForm';
import type { RootState } from '../redux/reducer';

type StateProps = {|
  email: ?string,
  isEnterPINModalOpen: boolean,
  isSuccess: boolean,
  isError: boolean,
|};

type DispatchProps = {|
  cancelConfirmEmail: () => any,
  confirmEmail: (value: string) => any,
  reset: (formName: string) => any,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  email: state.pui.account.email,
  isEnterPINModalOpen: state.pui.account.isEnterPINModalOpen,
  isSuccess: state.pui.account.isEnterPINSuccess,
  isError: state.pui.account.isEnterPINError,
});

const mapDispatchToProps: DispatchProps = {
  cancelConfirmEmail,
  confirmEmail,
  reset,
};

class EnterPINModal extends Component<StateProps & DispatchProps> {
  handleChange = (value: string) => {
    this.props.confirmEmail(value);
  };

  handleClose = () => {
    this.props.cancelConfirmEmail();
    this.props.reset(formName);
  };

  // eslint-disable-next-line
  render() {
    const { isSuccess, isError } = this.props;
    return (
      <Modal
        className={
          'pui-tx-modal pui-pin-modal' +
          (isSuccess ? ' pui-tx-success' : '') +
          (isError ? ' pui-tx-failed' : '')
        }
        open={this.props.isEnterPINModalOpen}
        onRequestClose={this.handleClose}
        passiveModal
        modalHeading="Enter the PIN from the Activation Email"
        modalLabel={
          isSuccess
            ? 'PIN is Correct'
            : isError
              ? 'Invalid PIN, Please Try Again'
              : 'Action Required'
        }
      >
        <div className="pui-tx-animation" />
        <EnterPINForm onChange={this.handleChange} />
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EnterPINModal);
