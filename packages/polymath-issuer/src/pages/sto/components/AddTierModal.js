// @flow

import React, { Component } from 'react';
import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'carbon-components-react';

class AddTierModal extends Component {
  handleClose = () => {
    this.props.closeModal();
  };

  handleConfirm = () => {
    this.props.closeModal();
    this.props.onConfirm();
  };

  render() {
    return (
      <ComposedModal
        open={this.props.isOpen}
        className={'pui-confirm-modal ' + this.props.className}
      >
        <ModalHeader
          label={this.props.headerLabel}
          title={this.props.title}
          buttonOnClick={this.handleClose}
        />
        <ModalBody>
          <div className="bx--modal-content__text">{this.props.content}</div>
        </ModalBody>

        <ModalFooter>
          <Button
            className="cancel-btn"
            kind="secondary"
            onClick={this.handleClose}
          >
            Cancel
          </Button>
          <Button onClick={this.handleConfirm}>{this.props.buttonLabel}</Button>
        </ModalFooter>
      </ComposedModal>
    );
  }
}

export default AddTierModal;
