// @flow

import * as React from 'react';

import Button from '../Button';
import Modal from '../Modal';

type Props = {|
  children: Node,
  isActionDisabled: boolean,
  actionButtonText: string,
  cancelButtonText: string,
  onClose: Function,
  onSubmit: Function,
  isOpen: boolean,
|};

const ActionModal = (props: Props) => {
  const {
    isOpen,
    onClose,
    onSubmit,
    isActionDisabled,
    actionButtonText,
    cancelButtonText,
    children,
    ...otherProps
  } = props;
  return (
    <Modal
      isOpen={isOpen}
      className="pui-action-modal"
      onClose={onClose}
      onSubmit={onSubmit}
      {...otherProps}
    >
      {children}
      <Modal.Footer>
        <Button className="cancel-btn" kind="secondary" onClick={onClose}>
          {cancelButtonText}
        </Button>
        <Button onClick={onSubmit} disabled={isActionDisabled}>
          {actionButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ActionModal.defaultProps = {
  isActionDisabled: false,
  actionButtonText: 'Confirm',
  cancelButtonText: 'Cancel',
  onClose: null,
};

export default ActionModal;
