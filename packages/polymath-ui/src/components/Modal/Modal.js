// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import { GlobalModalStyle, StyledIconButton } from './styles';
import SvgClose from '../../images/icons/Close';

type Props = {|
  children: Node,
  isOpen: boolean,
  onClose: Function,
  isCloseable: boolean,
|};

type State = {|
  forceClose: boolean,
|};

export default class Modal extends Component<Props, State> {
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
    const { children, className, isCloseable } = this.props;
    const { isOpen } = this.state;

    return (
      <Fragment>
        <GlobalModalStyle />
        <ReactModal
          isOpen={isOpen}
          contentLabel="Modal"
          closeTimeoutMS={2000}
          className={{
            base: `pui-modal ${className}`,
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
          {isCloseable && (
            <StyledIconButton
              Icon={SvgClose}
              onClick={this.handleCloseRequest}
            />
          )}
          {children}
        </ReactModal>
      </Fragment>
    );
  }
}
