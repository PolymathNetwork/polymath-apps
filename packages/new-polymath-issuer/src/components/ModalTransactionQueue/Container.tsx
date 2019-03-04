import React, { Component, Dispatch } from 'react';
import { connect } from 'react-redux';
import { ActionType } from 'typesafe-actions';
import { types, constants } from '@polymathnetwork/new-shared';
import { RootState } from '~/state/store';
import { createGetActiveTransactionQueue, getApp } from '~/state/selectors';
import { unsetActiveTransactionQueue } from '~/state/actions/app';
import {
  confirmTransactionQueue,
  cancelTransactionQueue,
  finishTransactionQueue,
} from '~/state/actions/transactionQueues';
import { ModalTransactionQueuePresenter } from './Presenter';

const actions = {
  unsetActiveTransactionQueue,
  confirmTransactionQueue,
  cancelTransactionQueue,
  finishTransactionQueue,
};

export interface StateProps {
  transactionQueue: types.TransactionQueuePojo | null;
  networkId?: constants.NetworkIds;
}

export interface DispatchProps {
  dispatch: Dispatch<ActionType<typeof actions>>;
}

export type Props = StateProps & DispatchProps;

const mapStateToProps = () => {
  const getActiveTransactionQueue = createGetActiveTransactionQueue();

  return (state: RootState): StateProps => {
    const transactionQueue = getActiveTransactionQueue(state);
    const { networkId } = getApp(state);
    return { transactionQueue, networkId };
  };
};

export class ModalTransactionQueueContainerBase extends Component<Props> {
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
    const { transactionQueue, networkId } = this.props;
    const { onContinue, onConfirm, onClose } = this;

    const transactionLinkSubdomain = networkId
      ? constants.EtherscanSubdomains[networkId]
      : '';

    if (!transactionQueue) {
      return null;
    }

    return (
      <ModalTransactionQueuePresenter
        transactionLinkSubdomain={transactionLinkSubdomain}
        transactionQueue={transactionQueue}
        onContinue={onContinue}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );
  }
}

export const ModalTransactionQueueContainer = connect(mapStateToProps)(
  ModalTransactionQueueContainerBase
);
