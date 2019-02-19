import React from 'react';
import { testUtils } from '@polymathnetwork/new-shared';
import { render } from '~/testUtils/helpers';
import { reducer } from '~/state/reducers/root';
import * as transactionQueueActions from '~/state/actions/transactionQueues';
import * as appActions from '~/state/actions/app';
import { createGetActiveTransactionQueue } from '~/state/selectors';
import { ModalTransactionQueueContainer as Container } from '../Container';
import { getType } from 'typesafe-actions';

jest.mock('~/state/selectors', () => {
  const original = require.requireActual('@polymathnetwork/sdk');

  return {
    ...original,
    createGetActiveTransactionQueue: jest.fn(() => jest.fn(() => undefined)),
  };
});

jest.mock('../Presenter', () => {
  const MockedPresenter = ({ onContinue, onClose, onConfirm }: any) => (
    <div data-testid="mockedPresenter">
      <button data-testid="continueButton" onClick={onContinue} />
      <button data-testid="confirmButton" onClick={onConfirm} />
      <button data-testid="closeButton" onClick={onClose} />
    </div>
  );

  return {
    ModalTransactionQueuePresenter: MockedPresenter,
  };
});

describe('ModalTransactionQueueContainer', () => {
  describe('rendering', () => {
    test("should not render the presenter if there's no transactionQueue", () => {
      const { getByTestId } = render(<Container />, {
        state: reducer(undefined, {} as any),
      });

      expect(() => {
        getByTestId('mockedPresenter');
      }).toThrow();
    });

    test('should render the presenter if there is a transactionQueue', () => {
      if (!jest.isMockFunction(createGetActiveTransactionQueue)) {
        return;
      }
      createGetActiveTransactionQueue.mockImplementationOnce(() =>
        jest.fn(() => testUtils.transactionQueuePojo())
      );

      const { getByTestId } = render(<Container />, {
        state: reducer(undefined, {} as any),
      });

      getByTestId('mockedPresenter');
    });
  });

  describe('#onFinish', () => {
    test('should unset the active transaction queue ', async () => {
      const transactionQueue = testUtils.transactionQueuePojo();
      let state = reducer(
        {} as any,
        transactionQueueActions.createAction(transactionQueue)
      );
      state = reducer(
        state,
        appActions.setActiveTransactionQueue(transactionQueue.uid)
      );

      if (!jest.isMockFunction(createGetActiveTransactionQueue)) {
        return;
      }

      createGetActiveTransactionQueue.mockImplementationOnce(() =>
        jest.fn(() => testUtils.transactionQueuePojo())
      );

      const { getByTestId, store } = render(<Container />, {
        state,
      });

      getByTestId('continueButton').click();

      expect(store.getActions()).toContainEqual(
        expect.objectContaining({
          type: getType(appActions.unsetActiveTransactionQueue),
        })
      );
    });
  });
});
