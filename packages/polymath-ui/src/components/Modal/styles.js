// @flow

import styled, { css } from 'styled-components';
import { maxWidth } from 'styled-system';

import IconButton from '../IconButton';

export const modalStyle = css`
  .pui-modal {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: white;
    min-width: 100%;
    max-height: 100%;
    width: 500px;
    height: 100%;
    padding: 3%;
    box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.1);
    overflow-y: auto;

    @media (min-width: 600px) {
      height: auto;
      min-width: 500px;
      max-width: 75%;
      max-height: 90%;
      padding: ${({ theme }) =>
        `calc(${theme.space.xl} - 10px) ${theme.space.xl}`};
    }

    @media (min-width: 1024px) {
      ${props =>
        props.maxWidth
          ? maxWidth({ ...props, maxWidth: props.maxWidth })
          : 'max-width: 50%'};
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
      font-family: $font;
      font-weight: 300;
      line-height: 24px;

      p {
        margin-top: 10px;
      }

      p:first-child {
        margin-top: -3px;
      }

      .bx--inline-notification__title {
        font-weight: 600 !important;
      }

      .bx--details {
        font-size: 12px;
        color: #152935;
        border-radius: 4px;
        background-color: #ebf0f7;
        padding: 6.5px 0 6.5px 16px;
        margin-top: 10px;
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
    align-items: center;
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

export const StyledIconButton = styled(IconButton)`
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
