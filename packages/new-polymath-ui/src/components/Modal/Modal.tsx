import React, { Component } from 'react';
import { MaxWidthProps } from 'styled-system';
import ReactModal from 'react-modal';

import styled, { withTheme, ThemeInterface } from '~/styles';

import { Header } from './Header';
import { Body } from './Body';
import { Footer } from './Footer';
import * as S from './styles';
import { ModalStatus } from './types';
import SvgClose from '../../images/icons/Close';

export interface ModalProps {
  children: Node;
  className: string;
  isOpen: boolean;
  onClose: Function;
  isCloseable: boolean;
  status: ModalStatus;
  theme: ThemeInterface;
  maxWidth: MaxWidthProps;
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
        {status !== ModalStatus.idle && <S.StatusBar status={status} />}
        {isCloseable && (
          <S.CloseButton Asset={SvgClose} onClick={this.handleCloseRequest} />
        )}
        <S.Inner>{children}</S.Inner>
      </ReactModal>
    );
  }
}

export const Modal = styled(withTheme(_Modal))`
  ${S.modalStyle};
`;
