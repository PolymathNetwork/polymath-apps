import reducer from '../stoModules';
import * as stoModulesActions from '../../actions/stoModules';
import { factories } from '../../../testUtils';

describe('Reducer: stoModules', () => {
  describe('on STO_MODULES_UPDATE', () => {
    test('updates the state properly', () => {
      const usdTieredSTO = factories.usdTieredSTO();
      const cappedSTO = factories.cappedSTO();

      const action = stoModulesActions.update([usdTieredSTO, cappedSTO]);
      const result = reducer(undefined, action);

      const {
        address: usdTieredSTOAddress,
        ...usdTieredSTOState
      } = usdTieredSTO;
      const { address: cappedSTOAddress, ...cappedSTOState } = cappedSTO;

      expect(result).toEqual({
        fetched: true,
        modules: {
          [usdTieredSTOAddress]: usdTieredSTOState,
          [cappedSTOAddress]: cappedSTOState,
        },
      });
    });
  });
});
