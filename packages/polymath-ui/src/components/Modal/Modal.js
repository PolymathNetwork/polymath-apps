// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

export default class Modal extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func,
    isCloseable: PropTypes.bool,
  };

  static defaultProps = {
    isOpen: false,
    isCloseable: true,
    onRequestClose: null,
  };

  state = {
    forceClose: false,
  };

  handleCloseRequest() {
    if (!this.props.isCloseable) {
      return;
    }

    if (this.props.onRequestClose === null) {
      this.setState({ forceClose: true });
    } else {
      this.props.onRequestClose();
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
      <ReactModal
        isOpen={isOpen}
        contentLabel="Modal"
        className={{
          base: 'bx--modal-container',
          afterOpen: '',
          beforeClose: '',
        }}
        overlayClassName={{
          base: 'bx--modal',
          afterOpen: 'is-visible',
          beforeClose: '',
        }}
        onRequestClose={this.handleCloseRequest.bind(this)}
      >
        {children}
      </ReactModal>
    );
  }
}
