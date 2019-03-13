import { runSaga } from 'redux-saga';
import * as sagas from '~/state/sagas/requests';
import * as dataRequestsActions from '~/state/actions/dataRequests';
import { fetchCheckpointsBySymbol } from '~/state/sagas/requests/checkpoints';
import { createCheckpointsBySymbolFetcher } from '~/state/fetchers';
import { MockedStore } from '~/testUtils/helpers';

jest.mock('~/state/sagas/requests/checkpoints', () => {
  return {
    fetchCheckpointsBySymbol: jest.fn(),
  };
});

describe('requests sagas', () => {
  let store: MockedStore;

  beforeEach(() => {
    store = new MockedStore();
  });

  describe('requestData', () => {
    test('should mark the request as failed if an error is thrown', async () => {
      const errorMessage = 'Random error';

      if (!jest.isMockFunction(fetchCheckpointsBySymbol)) {
        throw new Error('Module not mocked properly');
      }

      fetchCheckpointsBySymbol.mockImplementationOnce(function*() {
        throw new Error(errorMessage);
        yield;
      });

      const fetcher = createCheckpointsBySymbolFetcher({
        securityTokenSymbol: 'FOO ',
      });

      await runSaga(
        store,
        sagas.requestData,
        dataRequestsActions.requestData({ fetcher })
      );

      expect(store.dispatched).toContainEqual(
        expect.objectContaining(
          dataRequestsActions.fetchDataFail({
            errorMessage,
            requestKey: fetcher.requestKey,
            args: fetcher.args,
          })
        )
      );
    });
  });
});
