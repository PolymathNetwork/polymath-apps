import React, { Fragment, Component, Dispatch } from 'react';
import { connect } from 'react-redux';
import {
  ModalTransactionQueue,
  ModalConfirmTransactionQueue,
  TransactionItem,
  Paragraph,
  icons,
} from '@polymathnetwork/new-ui';
import { createGetActiveTransactionQueue } from '~/state/selectors';
import { RootState } from '~/state/store';
import { ActionType } from 'typesafe-actions';
import { unsetActiveTransactionQueue } from '~/state/actions/app';
import { types } from '@polymathnetwork/new-shared';

export interface StateProps {
  transactionQueue: types.TransactionQueuePojo | null;
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
  state = {
    isConfirming: false,
    isConfirmed: false,
  };

  public onContinue = () => {
    const { dispatch } = this.props;

    dispatch(unsetActiveTransactionQueue());
  };

  public handleConfirm = () => {
    this.setState({
      isConfirmed: true,
    });
  };

  public render() {
    const { transactionQueue } = this.props;
    const { isConfirmed, isConfirming } = this.state;

    if (!transactionQueue) {
      return null;
    }

    return (
      <Fragment>
        <ModalConfirmTransactionQueue
          isOpen={isConfirming}
          onSubmit={this.handleConfirm}
        >
          <ModalConfirmTransactionQueue.Header>
            {transactionQueue.procedureType}
          </ModalConfirmTransactionQueue.Header>
          <Paragraph fontSize={2}>{transactionQueue.description}</Paragraph>
          <div>
            {transactionQueue.transactions.map(transaction => (
              <TransactionItem
                key={transaction.uid}
                Asset={icons.SvgErc20}
                title="The transaction will be used to ...."
                description="2000000 TOKEN"
              />
            ))}
          </div>
        </ModalConfirmTransactionQueue>
        <ModalTransactionQueue
          isOpen={!!transactionQueue && isConfirmed}
          transactionQueue={transactionQueue}
          onContinue={this.onContinue}
        />
      </Fragment>
    );
  }
}

export const Container = connect(mapStateToProps)(ContainerBase);
