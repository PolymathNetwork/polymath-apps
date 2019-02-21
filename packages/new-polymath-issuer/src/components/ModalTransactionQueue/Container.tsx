import React, { Component, Dispatch } from 'react';
import { connect } from 'react-redux';
import { ActionType } from 'typesafe-actions';
import { types } from '@polymathnetwork/new-shared';
import { RootState } from '~/state/store';
import { createGetActiveTransactionQueue } from '~/state/selectors';
import { unsetActiveTransactionQueue } from '~/state/actions/app';
import {
  confirmTransactionQueue,
  cancelTransactionQueue,
} from '~/state/actions/transactionQueues';
import { ModalTransactionQueuePresenter } from './Presenter';

const actions = {
  unsetActiveTransactionQueue,
  confirmTransactionQueue,
  cancelTransactionQueue,
};

export interface StateProps {
  transactionQueue: types.TransactionQueuePojo | null;
}

export interface DispatchProps {
  dispatch: Dispatch<ActionType<typeof actions>>;
}

export type Props = StateProps & DispatchProps;

const mapStateToProps = () => {
  const getActiveTransactionQueue = createGetActiveTransactionQueue();

  return (state: RootState): StateProps => {
    const transactionQueue = getActiveTransactionQueue(state);

    return { transactionQueue };
  };
};

export class ModalTransactionQueueContainerBase extends Component<Props> {
  public onFinish = () => {
    const { dispatch } = this.props;

    dispatch(unsetActiveTransactionQueue());
  };

  public onClose = () => {
    const { dispatch } = this.props;

    this.onFinish();

    dispatch(cancelTransactionQueue());
  };

  public onConfirm = () => {
    const { dispatch } = this.props;

    dispatch(confirmTransactionQueue());
  };

  public render() {
    const { transactionQueue } = this.props;
    const { onFinish, onConfirm, onClose } = this;

    if (!transactionQueue) {
      return null;
    }

    return (
      <ModalTransactionQueuePresenter
        transactionQueue={transactionQueue}
        onContinue={onFinish}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );
  }
}

export const ModalTransactionQueueContainer = connect(mapStateToProps)(
  ModalTransactionQueueContainerBase
);
