import React, { Fragment } from 'react';

import { Modal } from './';
import { GetProps } from '~/typing';

type ModalProps = GetProps<typeof Modal>;
interface State {
  isModalOpen: boolean;
}

export class ModalDemo extends React.Component<ModalProps, State> {
  constructor(props: ModalProps) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  public handleClick = () => {
    this.setState({
      isModalOpen: true,
    });
  };

  public handleModalClose = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  public render() {
    return (
      <Fragment>
        <button className="btn" onClick={this.handleClick}>
          Open modal
        </button>
        <Modal
          isOpen={this.state.isModalOpen}
          onClose={this.handleModalClose}
          {...this.props}
        >
          Some content.
        </Modal>
      </Fragment>
    );
  }
}
