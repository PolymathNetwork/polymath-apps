import React, { Component, Dispatch } from 'react';
import { connect } from 'react-redux';
import { createGetActiveTransactionQueue } from '~/state/selectors';
import { RootState } from '~/state/store';
import { ActionType } from 'typesafe-actions';
import { unsetActiveTransactionQueue } from '~/state/actions/app';
import {
  confirmTransactionQueue,
  cancelTransactionQueue,
  finishTransactionQueue,
} from '~/state/actions/transactionQueues';
import { types } from '@polymathnetwork/new-shared';
import { Presenter } from './Presenter';

const actions = {
  unsetActiveTransactionQueue,
  confirmTransactionQueue,
  cancelTransactionQueue,
  finishTransactionQueue,
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

export class ContainerBase extends Component<Props> {
  public onFinish = () => {
    const { dispatch } = this.props;

    dispatch(unsetActiveTransactionQueue());
  };

  public onContinue = () => {
    const { dispatch } = this.props;

    this.onFinish();

    dispatch(finishTransactionQueue());
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
    const { onContinue, onConfirm, onClose } = this;

    if (!transactionQueue) {
      return null;
    }

    return (
      <Presenter
        transactionQueue={transactionQueue}
        onContinue={onContinue}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );
  }
}

export const Container = connect(mapStateToProps)(ContainerBase);
