// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Icon,
  Button,
} from 'carbon-components-react';

import { closeModal } from './actions';
import type { RootState } from '../../redux/reducer';
import type { ModalState } from './reducer';

import './style.scss';

type DispatchProps = {|
  closeModal: () => any,
|};

const mapStateToProps = (state: RootState): ModalState => state.pui.modal;

const mapDispatchToProps: DispatchProps = {
  closeModal,
};

class ConfirmModal extends Component<ModalState & DispatchProps> {
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
          title={
            // NOTE @RafaelVidaurre: Carbon components throws a warning here since it expects a string, not a Node
            <span>
              <Icon
                name="warning--glyph"
                fill="#E71D32"
                width="24"
                height="24"
              />
              &nbsp;
              {this.props.title}
            </span>
          } // eslint-disable-next-line react/jsx-handler-names
          buttonOnClick={this.handleClose}
        />
        <ModalBody>
          <div className="bx--modal-content__text">{this.props.content}</div>
        </ModalBody>

        <ModalFooter>
          {!this.props.isAlert ? (
            <Button
              className="cancel-btn"
              kind="secondary"
              onClick={this.handleClose}
            >
              Cancel
            </Button>
          ) : (
            ''
          )}
          <Button onClick={this.handleConfirm}>{this.props.buttonLabel}</Button>
        </ModalFooter>
      </ComposedModal>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmModal);
