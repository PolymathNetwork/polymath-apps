import React, { Component } from 'react';
import ReactModal from 'react-modal';

import { withTheme, ThemeInterface, styled } from '~/styles';

import { Header } from './Header';
import { Body } from './Body';
import { Footer } from './Footer';
import * as sc from './styles';
import { ModalStatus } from './types';
import { SvgClose } from '~/images/icons/Close';

interface Props {
  isOpen: boolean;
  status: ModalStatus;
  onClose?: () => void;
  className?: string;
  isCloseable?: boolean;
  maxWidth?: number | string;
  isCentered?: boolean;
  theme: ThemeInterface;
}

interface State {
  forceClose: boolean;
  isOpen: boolean;
}

class ModalBase extends Component<Props, State> {
  public static Header = Header;
  public static Body = Body;
  public static Footer = Footer;
  public static defaultProps = {
    status: ModalStatus.idle,
    isOpen: false,
    isCloseable: true,
    isCentered: true,
  };

  public state = {
    forceClose: false,
    isOpen: false,
  };

  public handleCloseRequest = () => {
    if (!this.props.isCloseable) {
      return;
    }

    if (this.props.onClose) {
      this.props.onClose();
    } else {
      this.setState({ forceClose: true });
    }
  };

  public render() {
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
          // FIXME @grsmto: svgs aren't compiling properly
          // <sc.CloseButton Asset={SvgClose} onClick={this.handleCloseRequest} />
          <sc.CloseButton Asset={null} onClick={this.handleCloseRequest} />
        )}
        <sc.Inner>{children}</sc.Inner>
      </ReactModal>
    );
  }
}

const EnhacedModal = styled(withTheme(ModalBase))`
  ${sc.modalStyle};
`;

export const Modal = Object.assign(EnhacedModal, {
  Header,
  Body,
  Footer,
  defaultProps: ModalBase.defaultProps,
});
