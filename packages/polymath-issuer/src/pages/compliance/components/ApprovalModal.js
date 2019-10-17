// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { Form } from 'carbon-components-react';
import { Remark, Modal, Button } from '@polymathnetwork/ui';
import validator from '@polymathnetwork/ui/validator';
import { addAddressToTransferManager } from '../../../actions/compliance';
import AddApprovalForm from './AddApprovalForm';

type Props = {
  isOpen: boolean,
  handleClose: () => any,
};

class ApprovalModal extends Component<Props> {
  render() {
    const { isOpen, handleClose } = this.props;
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <Modal.Body>
          <h1 className="pui-h2">Create Trade Approval</h1>
          <AddApprovalForm handleClose={handleClose} />
        </Modal.Body>
      </Modal>
    );
  }
}

export default ApprovalModal;
