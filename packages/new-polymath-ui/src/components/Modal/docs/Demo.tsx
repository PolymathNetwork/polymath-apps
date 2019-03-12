import React, { Fragment } from 'react';

import { Modal } from '../';
import { typeHelpers } from '@polymathnetwork/new-shared';

type ModalProps = typeHelpers.GetProps<typeof Modal>;
interface State {
  isModalOpen: boolean;
}

export class Demo extends React.Component<ModalProps, State> {
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
          <Modal.Header variant="alert" label="Confirmation required">
            Modal test
          </Modal.Header>
          <Modal.Body>
            <p>
              Completion of your token symbol reservation will require two
              wallet transactions.
            </p>
            <p>
              • The first transaction will be used to pay for the token symbol
              reservation cost of:
            </p>
            <div class="bx--details poly-cost">250 POLY</div>
            <p>
              • The second transaction will be used to pay the mining fee (aka
              gas fee) to complete the reservation of your token symbol.
            </p>
            <p>
              Please hit «CONFIRM» when you are ready to proceed. Once you hit
              «CONFIRM», your Token Symbol reservation will be sent to the
              blockchain and will be immutable unless it expires.
              <br /> Any change prior to your reservation expiry will require
              that you start the process over using another token symbol. If you
              do not wish to pay the token symbol reservation fee or wish to
              review your information, simply select «CANCEL».
            </p>
          </Modal.Body>
          <Modal.Footer>Random footer text.</Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}
