import React, { Fragment } from 'react';

import { Button } from '~/components/Button';
import { ModalConfirm } from './ModalConfirm';

export class ModalDemo extends React.Component {
  state = {
    isModalOpen: false,
  };

  handleClick() {
    this.setState({
      isModalOpen: true,
    });
  }

  handleModalClose = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  handleSubmit = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  render() {
    return (
      <Fragment>
        <Button onClick={this.handleClick}>Open modal</Button>

        <ModalConfirm
          isOpen={this.state.isModalOpen}
          onSubmit={this.handleSubmit}
          onClose={this.handleModalClose}
          {...this.props}
        >
          Some content
        </ModalConfirm>
      </Fragment>
    );
  }
}
