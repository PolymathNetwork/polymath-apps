import React, { Component, Dispatch } from 'react';
import { connect } from 'react-redux';
import { createGetActiveTransactionQueue } from '~/state/selectors';
import { RootState } from '~/state/store';
import { ActionType } from 'typesafe-actions';
import { unsetActiveTransactionQueue } from '~/state/actions/app';
import { confirmTransactionQueue } from '~/state/actions/transactionQueues';
import { types } from '@polymathnetwork/new-shared';
import { Presenter } from './Presenter';

const actions = {
  unsetActiveTransactionQueue,
  confirmTransactionQueue,
};

export interface StateProps {
  transactionQueue: types.TransactionQueuePojo | null;
}

export interface DispatchProps {
  dispatch: Dispatch<ActionType<typeof actions>>;
}

export type Props = StateProps & DispatchProps;

const mapStateToProps = () => {
  const queueSelector = createGetActiveTransactionQueue();

  return (state: RootState): StateProps => {
    const transactionQueue = queueSelector(state);

    return { transactionQueue };
  };
};

export class ContainerBase extends Component<Props> {
  public onFinish = () => {
    const { dispatch } = this.props;

    dispatch(unsetActiveTransactionQueue());
  };

  public onConfirm = () => {
    const { dispatch } = this.props;

    dispatch(confirmTransactionQueue());
  };

  public render() {
    const { transactionQueue } = this.props;
    const { onFinish, onConfirm } = this;

    if (!transactionQueue) {
      return null;
    }

    return (
      <Presenter
        transactionQueue={transactionQueue}
        onContinue={onFinish}
        onClose={onFinish}
        onConfirm={onConfirm}
      />
    );
  }
}

export const Container = connect(mapStateToProps)(ContainerBase);
