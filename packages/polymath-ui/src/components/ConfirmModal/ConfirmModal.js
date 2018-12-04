// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button } from 'carbon-components-react';

import Modal from '../Modal';

import { closeModal } from './actions';
import type { RootState } from '../../redux/reducer';
import type { ModalState } from './reducer';

type DispatchProps = {|
  closeModal: () => any,
|};

const mapStateToProps = (state: RootState): ModalState => state.pui.modal;

const mapDispatchToProps: DispatchProps = {
  closeModal,
};

class ConfirmModal extends Component<ModalState & DispatchProps> {
  handleClose = () => {
    this.props.closeModal();
  };

  handleConfirm = () => {
    this.props.closeModal();
    this.props.onConfirm();
  };

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        className={'pui-confirm-modal ' + this.props.className}
        onClose={this.handleClose}
      >
        <Modal.Header status="warning" label={this.props.headerLabel}>
          <span>
            <Icon name="warning--glyph" fill="#EFC100" width="24" height="24" />
            &nbsp;
            {this.props.title}
          </span>
        </Modal.Header>
        <Modal.Body>
          <div className="bx--modal-content__text">{this.props.content}</div>
        </Modal.Body>

        <Modal.Footer>
          {!this.props.isAlert ? (
            <Button
              className="cancel-btn"
              kind="secondary"
              onClick={this.handleClose}
            >
              Cancel
            </Button>
          ) : (
            ''
          )}
          <Button onClick={this.handleConfirm}>{this.props.buttonLabel}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmModal);
