// @flow

import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import { modalStyle, StyledIconButton } from './styles';
import SvgClose from '../../images/icons/Close';

type Props = {|
  children: Node,
  className: string,
  isOpen: boolean,
  onClose: Function,
  isCloseable: boolean,
  theme: any,
|};

type State = {|
  forceClose: boolean,
  isOpen: boolean,
|};

class Modal extends Component<Props, State> {
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
    isOpen: false,
  };

  handleCloseRequest = () => {
    if (!this.props.isCloseable) {
      return;
    }

    if (this.props.onClose === null) {
      this.setState({ forceClose: true });
    } else {
      this.props.onClose();
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      isOpen: !prevState.forceClose && nextProps.isOpen,
    };
  }

  render() {
    const { children, className, isCloseable, theme } = this.props;
    const { isOpen } = this.state;

    return (
      <ReactModal
        isOpen={isOpen}
        contentLabel="Modal"
        closeTimeoutMS={theme.transitions.modal.ms}
        className={{
          base: 'pui-modal',
          afterOpen: 'pui-modal--after-open',
          beforeClose: 'pui-modal--before-close',
        }}
        overlayClassName={{
          base: `pui-modal__overlay ${className}`,
          afterOpen: 'pui-modal__overlay--after-open',
          beforeClose: 'pui-modal__overlay--before-close',
        }}
        onRequestClose={this.handleCloseRequest}
      >
        {isCloseable && (
          <StyledIconButton Icon={SvgClose} onClick={this.handleCloseRequest} />
        )}
        {children}
      </ReactModal>
    );
  }
}

const StyledModal = styled(withTheme(Modal))`
  ${modalStyle};
`;

export default StyledModal;
