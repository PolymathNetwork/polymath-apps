// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { Form } from 'carbon-components-react';
import { Remark, Modal, Button } from '@polymathnetwork/ui';
import validator from '@polymathnetwork/ui/validator';
import { addAddressToTransferManager } from '../../../actions/compliance';
import GlobalRestrictionsForm from './GlobalRestrictionsForm';

type Props = {
  isOpen: boolean,
  handleClose: () => any,
  restrictionType: string,
};

export class FormModal extends Component<Props> {
  render() {
    const { isOpen, handleClose, restrictionType } = this.props;
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <Modal.Body>
          {restrictionType === 'custom' && (
            <h1 className="pui-h2">
              Configure Custom Trade Volume Restriction
            </h1>
          )}
          {restrictionType === '24h' && (
            <h1 className="pui-h2">Configure Daily Trade Volume Restriction</h1>
          )}
          <h3 className="pui-h3">
            The volume restriction can be specified in number of tokens or as a
            percentage of total supply and will be enforced only between the
            Start date and time and the End date and time.
          </h3>
          <Remark title="Note">
            — Volume restrictions do not apply to primary issuance, only to
            secondary trades.
            <br />— The Global Restriction applies to each Investor
            individually, not the aggregate of all sales across all investors
            within the period.
          </Remark>
          <GlobalRestrictionsForm
            handleClose={handleClose}
            restrictionType={restrictionType}
          />
        </Modal.Body>
      </Modal>
    );
  }
}

export default FormModal;
