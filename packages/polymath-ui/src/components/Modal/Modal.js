// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { createGlobalStyle } from 'styled-components';

const GlobalModalStyle = createGlobalStyle`
  .bx--modal.pui-modal__overlay--after-open {
    opacity: 1;
    visibility: visible;
    transition: all 150ms;
    z-index: 9000;
  }

  .bx--modal.pui-modal__overlay--before-close {
    opacity: 0;
    visibility: hidden;
  }
`;

export default class Modal extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    isCloseable: PropTypes.bool,
  };

  static defaultProps = {
    isOpen: false,
    isCloseable: true,
    onClose: null,
  };

  state = {
    forceClose: false,
  };

  handleCloseRequest() {
    if (!this.props.isCloseable) {
      return;
    }

    if (this.props.onClose === null) {
      this.setState({ forceClose: true });
    } else {
      this.props.onClose();
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      isOpen: !prevState.forceClose && nextProps.isOpen,
    };
  }

  render() {
    const { children } = this.props;
    const { isOpen } = this.state;

    return (
      <Fragment>
        <GlobalModalStyle />
        <ReactModal
          isOpen={isOpen}
          contentLabel="Modal"
          closeTimeoutMS={2000}
          className={{
            base: `bx--modal-container pui-modal`,
            afterOpen: 'pui-modal--after-open',
            beforeClose: 'pui-modal--before-close',
          }}
          overlayClassName={{
            base: `bx--modal pui-modal__overlay`,
            afterOpen: 'pui-modal__overlay--after-open',
            beforeClose: 'pui-modal__overlay--before-close',
          }}
          onRequestClose={this.handleCloseRequest.bind(this)}
        >
          {children}
        </ReactModal>
      </Fragment>
    );
  }
}
