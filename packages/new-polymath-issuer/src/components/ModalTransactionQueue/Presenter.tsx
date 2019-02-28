import React, { Fragment, Component } from 'react';
import {
  ModalTransactionQueue,
  ModalConfirmTransactionQueue,
} from '@polymathnetwork/new-ui';
import { types } from '@polymathnetwork/new-shared';

export interface Props {
  transactionQueue: types.TransactionQueuePojo;
  onContinue: () => void;
  onConfirm: () => void;
  onClose: () => void;
}

export class ModalTransactionQueuePresenter extends Component<Props> {
  public state = {
    isConfirmed: false,
  };

  public handleConfirm = () => {
    this.setState({
      isConfirmed: true,
    });

    this.props.onConfirm();
  };

  public render() {
    const { transactionQueue, onClose } = this.props;
    const { isConfirmed } = this.state;

    if (!transactionQueue) {
      return null;
    }

    return (
      <Fragment>
        <ModalConfirmTransactionQueue
          onSubmit={this.handleConfirm}
          transactionQueue={transactionQueue}
          isOpen={!!transactionQueue && !isConfirmed}
          onClose={onClose}
        />
        <ModalTransactionQueue
          isOpen={!!transactionQueue && isConfirmed}
          transactionQueue={transactionQueue}
          onContinue={this.props.onContinue}
        />
      </Fragment>
    );
  }
}
