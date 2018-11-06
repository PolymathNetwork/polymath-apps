// @flow

import React, { Component } from 'react';
import { Modal } from 'carbon-components-react';

import ApplyForm from './ApplyForm';

type Props = {|
  isOpen: boolean,
  catName: string,
  onClose: () => any,
  onSubmit: () => any,
|};

export default class ApplyModal extends Component<Props> {
  handleSubmit = () => {
    this.props.onSubmit();
  };

  render() {
    const { isOpen, catName, onClose } = this.props;
    return (
      <Modal
        open={isOpen}
        onRequestClose={onClose}
        modalHeading={'Apply to ' + catName + ' Providers'}
        passiveModal
        className="providers-apply-modal"
      >
        <h4 className="pui-h4">
          The information you enter below will be sent to the {catName}{' '}
          Providers your selected.
        </h4>
        <p className="bx--type-epsilon">
          Note: All fields are mandatory unless otherwise stated
        </p>
        <br />
        <br />
        <ApplyForm onSubmit={this.handleSubmit} onClose={onClose} />
      </Modal>
    );
  }
}
