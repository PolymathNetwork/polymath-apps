// @flow

import React, { Component } from 'react';
import { Modal } from '@polymathnetwork/ui';

import ApplyForm from './ApplyForm';

type Props = {|
  isOpen: boolean,
  catName: string,
  onClose: () => any,
  onSubmit: () => any,
  selectedProviders: Array<any>,
|};

export default class ApplyModal extends Component<Props> {
  handleSubmit = () => {
    this.props.onSubmit();
  };

  render() {
    const { isOpen, catName, onClose, selectedProviders } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="providers-apply-modal"
      >
        <Modal.Header>{'Apply to ' + catName + ' Providers'}</Modal.Header>
        <h4 className="pui-h4">
          The information you enter below will be sent to the {catName}{' '}
          Providers you selected.
        </h4>
        <br />
        <br />
        <ApplyForm selectedProviders={selectedProviders} onClose={onClose} />
      </Modal>
    );
  }
}
