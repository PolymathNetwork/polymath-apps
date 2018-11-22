// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import styled, { createGlobalStyle } from 'styled-components';

import SvgClose from '../../images/icons/Close';
import IconButton from '../IconButton';

const GlobalModalStyle = createGlobalStyle`
  .pui-modal {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: white;
    min-width: 100%;
    max-height: 100%;
    height: 100%;
    padding: 3%;
    box-shadow: 0 12px 24px 0 rgba(0,0,0,.1);

    @media (min-width: 600px) {
      height: auto;
      min-width: 500px;
      max-width: 75%;
      max-height: 90%;
      padding: ${({ theme }) =>
        `calc(${theme.space.xl} - 5px) ${theme.space.xl}`};
    }

    @media (min-width: 1024px) {
      max-width: 50%;
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
  }

  .pui-modal__overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    display: flex;
    align-items: center;
    justify-content: center;
    content: '';
    opacity: 0;
    background-color: rgba(223, 227, 230, 0.5);
    transition: opacity 200ms, z-index 0s 200ms, visibility 0s 200ms;
    visibility: hidden;

    &.pui-modal__overlay--after-open {
      opacity: 1;
      visibility: visible;
      transition: all 150ms;
      z-index: 9000;
    }

    &.pui-modal__overlay--before-close {
      opacity: 0;
      visibility: hidden;
    }
  }
`;

const StyledIconButton = styled(IconButton)`
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
            base: `pui-modal`,
            afterOpen: 'pui-modal--after-open',
            beforeClose: 'pui-modal--before-close',
          }}
          overlayClassName={{
            base: `pui-modal__overlay`,
            afterOpen: 'pui-modal__overlay--after-open',
            beforeClose: 'pui-modal__overlay--before-close',
          }}
          onRequestClose={this.handleCloseRequest}
        >
          <StyledIconButton Icon={SvgClose} onClick={this.handleCloseRequest} />
          {children}
        </ReactModal>
      </Fragment>
    );
  }
}
