import React, { Component } from 'react';
import { MaxWidthProps } from 'styled-system';
import ReactModal from 'react-modal';

import styled, { withTheme, ThemeInterface } from '~/styles';

import { Header } from './Header';
import { Body } from './Body';
import { Footer } from './Footer';
import * as sc from './styles';
import { ModalStatus } from './types';
import { ReactComponent as SvgClose } from '~/images/icons/close.svg';

export interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: Node;
  className?: string;
  isCloseable?: boolean;
  status?: ModalStatus;
  maxWidth?: MaxWidthProps;
  isCentered?: boolean;
  theme?: ThemeInterface;
}

type State = {
  forceClose: boolean;
  isOpen: boolean;
};

class _Modal extends Component<ModalProps, State> {
  public static Header = Header;
  public static Body = Body;
  public static Footer = Footer;

  static defaultProps = {
    status: ModalStatus.idle,
    isOpen: false,
    isCloseable: true,
    onClose: null,
    isCentered: true,
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

  static getDerivedStateFromProps(nextProps: any, prevState: State) {
    return {
      isOpen: !prevState.forceClose && nextProps.isOpen,
    };
  }

  render() {
    const { children, className, isCloseable, theme, status } = this.props;
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
        {status !== ModalStatus.idle && <sc.StatusBar status={status} />}
        {isCloseable && (
          <sc.CloseButton Asset={SvgClose} onClick={this.handleCloseRequest} />
        )}
        <sc.Inner>{children}</sc.Inner>
      </ReactModal>
    );
  }
}

export const Modal = styled(withTheme(_Modal))`
  ${sc.modalStyle};
`;
