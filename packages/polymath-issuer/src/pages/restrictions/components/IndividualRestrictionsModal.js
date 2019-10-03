// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { Form } from 'carbon-components-react';
import { Remark, Modal, Button } from '@polymathnetwork/ui';
import validator from '@polymathnetwork/ui/validator';
import { addAddressToTransferManager } from '../../../actions/compliance';
import IndividualRestrictionsForm from './IndividualRestrictionsForm';

type Props = {
  isOpen: boolean,
  handleClose: () => any,
};

class IndividualRestrictionsModal extends Component<Props> {
  render() {
    const { isOpen, handleClose } = this.props;
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <Modal.Body>
          <h1 className="pui-h2">Add New Individual Restriction</h1>
          <h3 className="pui-h3">
            The volume restriction can be specified in number of tokens or as a
            percentage of total supply and will be enforced only between the
            Start Date/Time and the End Date/Time.
          </h3>
          <Remark title="Note">
            — Volume restrictions do not apply to primary issuance, only to
            secondary trades.
            <br />— The Restriction only applies to the specified Investor.
          </Remark>
          <IndividualRestrictionsForm handleClose={handleClose} />
        </Modal.Body>
      </Modal>
    );
  }
}

export default IndividualRestrictionsModal;
