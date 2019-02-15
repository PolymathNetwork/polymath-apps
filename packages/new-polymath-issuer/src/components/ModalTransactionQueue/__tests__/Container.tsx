import React from 'react';
import { ModalTransactionQueueContainer as Container } from '../Container';
import { reducer } from '~/state/reducers/root';
import { ModalTransactionQueuePresenter } from '../Presenter';
import { render } from '~/testUtils/helpers';

jest.mock('../Presenter', () => {
  const MockedPresenter = ({
    onContinue,
    onClose,
    onConfirm,
    transactionQueue,
  }: any) => (
    <div data-testid="mockedPresenter">
      <button data-testid="continueButton" onClick={onContinue} />
      <button data-testid="finishButton" onClick={onConfirm} />
      <button data-testid="closeButton" onClick={onClose} />
      <div data-testid="transactionQueue">{transactionQueue}</div>
    </div>
  );

  return {
    ModalTransactionQueuePresenter: MockedPresenter,
  };
});

const mockReducer = reducer;

describe('ModalTransactionQueueContainer', () => {
  test("should not render the presenter if there's no transactionQueue", () => {
    // const { container } = render(<Container />, { mockReducer });
  });
});
