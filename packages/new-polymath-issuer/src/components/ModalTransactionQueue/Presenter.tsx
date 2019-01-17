import React, { Fragment, Component } from 'react';
import {
  ModalTransactionQueue,
  ModalConfirmTransactionQueue,
} from '@polymathnetwork/new-ui';
import { types } from '@polymathnetwork/new-shared';

export interface Props {
  transactionQueue: types.TransactionQueuePojo;
  onContinue: () => void;
}

export class Presenter extends Component<Props> {
  state = {
    isConfirmed: false,
  };

  public handleConfirm = () => {
    this.setState({
      isConfirmed: true,
    });
  };

  public render() {
    const { transactionQueue } = this.props;
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
