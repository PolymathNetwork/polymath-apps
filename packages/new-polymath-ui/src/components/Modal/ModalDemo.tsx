import React, { Fragment } from 'react';

import { Modal } from './';

export class ModalDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      isModalOpen: true,
    });
  }

  handleModalClose() {
    this.setState({
      isModalOpen: false,
    });
  }

  render() {
    return (
      <Fragment>
        <button className="btn" onClick={this.handleClick}>
          Open modal
        </button>
        <Modal
          isOpen={this.state.isModalOpen}
          title="Modal test"
          onClose={this.handleModalClose.bind(this)}
          {...this.props}
        >
          Some content.
        </Modal>
      </Fragment>
    );
  }
}
