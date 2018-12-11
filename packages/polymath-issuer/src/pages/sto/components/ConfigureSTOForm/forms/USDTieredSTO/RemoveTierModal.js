// @flow

import React, { Component } from 'react';
import { ActionModal } from '@polymathnetwork/ui';

class RemoveTierModal extends Component {
  handleOnRemove = () => {
    this.props.onRemove(this.props.tierIndex);
  };

  render() {
    const { tierIndex, onClose } = this.props;

    return (
      <ActionModal
        isOpen={!!tierIndex}
        onClose={onClose}
        actionButtonText="Confirm Remove"
        onSubmit={this.handleOnRemove}
        maxWidth={740}
      >
        <ActionModal.Header>Remove Tier ???</ActionModal.Header>
        <ActionModal.Body>Are you sure?</ActionModal.Body>
      </ActionModal>
    );
  }
}

export default RemoveTierModal;
