import { maxWidth } from 'styled-system';

import styled, { css, ThemeInterface } from '~/styles';

import { ModalStatus, ModalProps } from './';
import { IconButton } from '../IconButton';

const statusBarHeight = '8px';

export const modalStyle = css`
  .pui-modal {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: white;
    min-width: 100%;
    max-height: 100%;
    min-height: 350px;
    height: 100%;
    padding: 3%;
    box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.1);
    outline: none;
    margin-top: ${({ isCentered }) => (isCentered ? '0' : '20vh')};

    @media (min-width: 600px) {
      height: auto;
      min-width: 500px;
      max-width: 75%;
      max-height: 90%;
      padding: ${({ theme }) =>
        `calc(${theme.space.xl} - 10px) ${theme.space.xl}`};
    }

    @media (min-width: 1024px) {
      ${(props: ModalProps) =>
        props.maxWidth ? maxWidth(props) : 'max-width: 50%'};
      max-height: 80%;
    }

    .bx--modal-header__heading {
      margin-bottom: 10px;
      line-height: 35px;
    }

    .bx--modal-header__label {
      color: ${({ theme }) => theme.colors.red};
      text-transform: none;
      font-size: 13px;
    }

    .bx--modal-header__heading {
      color: $poly-blue;
      font-size: 28px;
      line-height: 42px;
      font-weight: 600;
      font-family: $font;
    }

    .bx--modal-content__text,
    .bx--modal-content__text p {
      .bx--inline-notification__title {
        font-weight: 600 !important;
      }

      .bx--details {
        font-size: 12px;
        color: #152935;
        border-radius: 4px;
        background-color: #ebf0f7;
        padding: 6.5px 0 6.5px 16px;
        margin: 20px 0;
      }
    }
  }

  // TODO @grsmto: remove hack once we refactored ConfirmModal Redux actions:
  // the action should not pass an hardcoded class name
  &.pui-large-confirm-modal .pui-modal {
    width: 700px;
  }

  &.pui-modal__overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    display: flex;
    align-items: ${({ isCentered }) => (isCentered ? 'center' : 'flex-start')};
    justify-content: center;
    opacity: 0;
    background-color: rgba(223, 227, 230, 0.5);

    &.pui-modal__overlay--after-open {
      opacity: 1;
      transition: all ${({ theme }) => theme.transitions.modal.ms}ms;
      z-index: 9000;
    }

    &.pui-modal__overlay--before-close {
      opacity: 0;
    }
  }
`;

export const Inner = styled.div`
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  flex-grow: 1;
`;

export const CloseButton = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 0;
  color: ${({ theme }) => theme.colors.gray[2]};
  height: 44px;
  width: 44px;
  padding: 17px;
  overflow: hidden;
  cursor: pointer;

  :hover {
    color: ${({ theme }) => theme.colors.gray[3]};
  }
`;

const loadingStyles = `
  background: linear-gradient(60deg, #252e6a, #5495e5, #5495e5, #5495e5, #252e6a);
  background-size: 300% 300%;
  animation: AnimatedGradient 3s infinite;
`;

export const StatusBar = styled.div`
  position: absolute;
  top: -${statusBarHeight};
  left: 0;
  right: 0;
  width: 100%;
  height: ${statusBarHeight};
  ${({ status, theme }: { status: ModalStatus; theme: ThemeInterface }) =>
    status === ModalStatus.loading
      ? loadingStyles
      : `background: ${theme.colors[ModalStatus[status]]}`};

  @keyframes AnimatedGradient {
    0% {
      background-position: 0 0;
    }
    50% {
      background-position: 100% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
`;
