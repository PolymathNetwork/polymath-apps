// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { Form } from 'carbon-components-react';
import { Remark, Modal, Button } from '@polymathnetwork/ui';
import validator from '@polymathnetwork/ui/validator';
import { addAddressToTransferManager } from '../../../actions/compliance';
import AddApprovalForm from './AddApprovalForm';
import EditApprovalForm from './EditApprovalForm';

type Props = {
  isOpen: boolean,
  isEdit: boolean,
  handleClose: () => any,
};

class ApprovalModal extends Component<Props> {
  render() {
    const { isOpen, handleClose, isEdit } = this.props;
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <Modal.Body>
          <h1 className="pui-h2">{`${
            isEdit ? 'Edit' : 'Create'
          } Trade Approval`}</h1>
          {isEdit ? (
            <EditApprovalForm handleClose={handleClose} />
          ) : (
            <AddApprovalForm handleClose={handleClose} />
          )}
        </Modal.Body>
      </Modal>
    );
  }
}

export default ApprovalModal;
