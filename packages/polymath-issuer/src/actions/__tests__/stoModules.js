import { isFSA } from 'flux-standard-action';
import * as actions from '../stoModules';
import * as tokenActions from '../token';
import rootReducer from '../../redux/reducer';
import { getSTOModules } from '../../utils/contracts';
import { mockStore, factories } from '../../../testUtils';

jest.mock('../../utils/contracts');

describe('Actions: stoModulesDetails', () => {
  describe('update', () => {
    test('returns expected action', () => {
      const usdTieredSTO = factories.usdTieredSTO();
      const cappedSTO = factories.cappedSTO();

      const expectedPayload = {
        stoModules: [usdTieredSTO, cappedSTO],
      };

      const result = actions.update([usdTieredSTO, cappedSTO]);
      expect(isFSA(result)).toEqual(true);
      expect(result.payload).toEqual(expectedPayload);
    });
  });

  describe('fetch', () => {
    test('it dispatches STO_MODULES_UPDATE with available STO modules', async () => {
      const securityToken = factories.securityToken();
      const stoModules = [factories.usdTieredSTO(), factories.cappedSTO()];

      getSTOModules.mockImplementationOnce(() => stoModules);

      const test = tokenActions.data(securityToken);
      const state = rootReducer(undefined, test);
      const store = mockStore(state);

      await store.dispatch(actions.fetch());

      const [action] = store.getActions();
      expect(action).toHaveProperty('type', actions.STO_MODULES_UPDATE);
      expect(action).toHaveProperty('payload', { stoModules });
    });
  });
});
