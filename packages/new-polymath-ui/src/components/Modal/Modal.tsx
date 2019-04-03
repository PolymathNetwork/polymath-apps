import React, { FC, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import scrollbarWidth from 'scrollbarwidth';
import { withTheme, ThemeInterface, styled } from '~/styles';
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

function hasScrollbar() {
  return document.documentElement.scrollHeight > window.innerHeight;
}

export const ModalBase: FC<Props> = ({
  children,
  className,
  isOpen,
  isCloseable,
  isCentered,
  onClose,
  theme,
  status,
}) => {
  let overlayRef: HTMLDivElement | null = null;
  const [prevOpen, setPrevOpen] = useState(false);
  const handleCloseRequest = () => {
    if (!isCloseable) {
      return;
    }

    if (onClose) {
      onClose();
    }
  };

  // As modal is focused on open, we scroll it up to make sure we're at the top
  const handleAfterOpen = () => {
    if (overlayRef) {
      overlayRef.scroll(0, 0);
    }
  };

  useEffect(
    () => {
      if (prevOpen !== isOpen) {
        if (isOpen) {
          if (hasScrollbar()) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth()}px`;
          }
        } else {
          document.body.style.overflow = null;
          document.body.style.paddingRight = null;
        }

        setPrevOpen(isOpen);
      }

      return () => {
        document.body.style.overflow = null;
        document.body.style.paddingRight = null;
      };
    },
    [isOpen]
  );

  return (
    <ReactModal
      isOpen={isOpen}
      appElement={document.getElementById('root') || undefined}
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
      onAfterOpen={handleAfterOpen}
      onRequestClose={handleCloseRequest}
      overlayRef={node => (overlayRef = node)}
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
      <sc.Inner isCentered={isCentered}>{children}</sc.Inner>
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
