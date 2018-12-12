// @flow

import React, { Component } from 'react';
import { ActionModal, IconText, Icon } from '@polymathnetwork/ui';
import WarningIcon from '@polymathnetwork/ui/images/icons/Warning';

class RemoveTierModal extends Component {
  handleOnRemove = () => {
    const { onRemove, onClose, tierIndex } = this.props;
    onRemove(tierIndex);
    onClose();
  };

  render() {
    const { isOpen, onClose } = this.props;

    return (
      <ActionModal
        isOpen={isOpen}
        onClose={onClose}
        actionButtonText="Confirm Remove"
        onSubmit={this.handleOnRemove}
        maxWidth={500}
      >
        <ActionModal.Header status="warning" label="Confirmation Required">
          <IconText>
            <Icon Icon={WarningIcon} status="warning" />{' '}
            <span>Are You Sure You Want To Delete This Tier?</span>
          </IconText>
        </ActionModal.Header>
        <ActionModal.Body>
          Please confirm that you would like to delete this tier.
        </ActionModal.Body>
      </ActionModal>
    );
  }
}

export default RemoveTierModal;
