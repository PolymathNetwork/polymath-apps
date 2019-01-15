import React, { Component, Dispatch } from 'react';
import { connect } from 'react-redux';
import { ModalTransactionQueue } from '@polymathnetwork/new-ui';
import { createGetActiveTransactionQueue } from '~/state/selectors';
import { RootState } from '~/state/store';
import { ActionType } from 'typesafe-actions';
import { unsetActiveTransactionQueue } from '~/state/actions/app';
import { types } from '@polymathnetwork/new-shared';

export interface StateProps {
  transactionQueue: types.TransactionQueueEntity;
}

export interface DispatchProps {
  dispatch: Dispatch<ActionType<typeof unsetActiveTransactionQueue>>;
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
  public onContinue = () => {
    const { dispatch } = this.props;

    dispatch(unsetActiveTransactionQueue());
  };
  public render() {
    const { transactionQueue } = this.props;

    if (!transactionQueue) {
      return null;
    }

    return (
      <ModalTransactionQueue
        isOpen={!!transactionQueue}
        transactionQueue={transactionQueue}
        onContinue={this.onContinue}
      />
    );
  }
}

export const Container = connect(mapStateToProps)(ContainerBase);