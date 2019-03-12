import React, { FC, useState, useLayoutEffect } from 'react';
import ReactModal from 'react-modal';
import { withTheme, ThemeInterface, styled } from '~/styles';
import { useLockScroll } from '~/components/utils/hooks';
import { Header } from './Header';
import { Body } from './Body';
import { Footer } from './Footer';
import * as sc from './styles';
import { ModalStatus } from './types';
import { SvgClose } from '~/images/icons/Close';

interface Props {
  isOpen: boolean;
  status?: ModalStatus;
  onClose?: () => void;
  className?: string;
  isCloseable?: boolean;
  maxWidth?: number | string;
  isCentered?: boolean;
  theme: ThemeInterface;
}

export const ModalBase: FC<Props> = ({
  children,
  className,
  isOpen,
  isCloseable,
  onClose,
  theme,
  status,
}) => {

  useLockScroll(isOpen, {
    el: document.body,
    delay: theme.transitions.modal.ms,
  });

  const handleCloseRequest = () => {
    if (!isCloseable) {
      return;
    }

    if (onClose) {
      onClose();
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Modal"
      closeTimeoutMS={theme.transitions.modal.ms}
      ariaHideApp={false}
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
      onRequestClose={handleCloseRequest}
      // overlayRef={node => (overlayRef = node)}
      // contentRef={node => (contentRef = node)}
    >
      {!!status && <sc.StatusBar status={status} />}
      {isCloseable && (
        <sc.CloseButton
          Asset={SvgClose}
          onClick={handleCloseRequest}
          height={44}
          width={44}
          color="gray.2"
          scale={0.62}
        />
      )}
      <sc.Inner>{children}</sc.Inner>
    </ReactModal>
  );
};

ModalBase.defaultProps = {
  isOpen: false,
  isCloseable: true,
  isCentered: true,
};

const EnhancedModal = styled(withTheme(ModalBase))`
  ${sc.modalStyle};
`;

export const Modal = Object.assign(EnhancedModal, {
  defaultProps: ModalBase.defaultProps,
  Header,
  Body,
  Footer,
});
