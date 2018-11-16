import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import type { MockStoreEnhanced } from 'redux-mock-store';
import * as actions from '../actions';

const mockStore = configureMockStore([thunk]);

const mockTxData = {
  titles: 'Some transaction title',
  successTitle: 'Success title',
  code: async () => {},
  continueCode: async () => {},
  continueRoute: 'continue-route',
  continueLabel: 'continue-label',
  isNoEmail: true,
  headingOverride: true,
};
const txArgs = [
  mockTxData.titles,
  mockTxData.code,
  mockTxData.successTitle,
  mockTxData.continueCode,
  mockTxData.continueRoute,
  mockTxData.continueLabel,
  mockTxData.isNoEmail,
  mockTxData.headingOverride,
];

let store: MockStoreEnhanced<any>;

beforeEach(() => {
  store = mockStore();
});

describe('Actions: tx', () => {
  describe('tx', () => {
    test('it is a thunk', () => {
      const returnType = typeof actions.tx(...txArgs);
      expect(returnType).toEqual('function');
    });

    test('should dispatch START action', async () => {
      // TODO @RafaelVidaurre: Remove when an action creator for START exists
      await store.dispatch(actions.tx(...txArgs));
      const [dispatchedAction] = store.getActions();
      expect(dispatchedAction.type).toEqual(actions.START);
    });
  });
});
