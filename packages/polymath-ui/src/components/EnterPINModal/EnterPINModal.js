// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reset } from 'redux-form';

import { cancelConfirmEmail, confirmEmail } from '../../redux/account/actions';
import EnterPINForm, { formName } from './EnterPINForm';

import Modal from '../Modal';

import type { RootState } from '../../redux/reducer';

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

type State = {
  isLoading: boolean,
};

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

class EnterPINModal extends Component<StateProps & DispatchProps & State> {
  state = {
    isLoading: false,
  };

  handleChange = async (value: string) => {
    try {
      this.setState({
        isLoading: true,
      });
      await this.props.confirmEmail(value);
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    }
  };

  handleClose = () => {
    this.props.cancelConfirmEmail();
    this.props.reset(formName);
  };

  // eslint-disable-next-line
  render() {
    const { isSuccess, isError } = this.props;
    const { isLoading } = this.state;
    return (
      <Modal
        className={
          'pui-tx-modal pui-pin-modal' +
          (isSuccess ? ' pui-tx-success' : '') +
          (isError ? ' pui-tx-failed' : '')
        }
        isOpen={this.props.isEnterPINModalOpen}
        onClose={this.handleClose}
        isCloseable={false}
        status={isLoading && 'loading'}
      >
        <Modal.Header
          status={isSuccess ? 'success' : isError ? 'alert' : 'idle'}
          label={
            isSuccess
              ? 'PIN is Correct'
              : isError
                ? 'Invalid PIN, Please Try Again'
                : 'Action Required'
          }
        >
          Enter the PIN from the Activation Email
        </Modal.Header>
        <EnterPINForm onChange={this.handleChange} />
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EnterPINModal);
