import reducer from '../stoModules';
import * as stoModulesActions from '../../actions/stoModules';

describe('Reducer: stoModules', () => {
  test('on STO_MODULES_UPDATE', () => {
    const usdTieredSTO = {
      type: 'USDTieredSTO',
      address: 'FakeUSDTieredSTOAddress',
      ownerAddress: 'FakeUSDTieredSTOOwnerAddress',
      description: 'USDTieredSTO Description',
      setupCost: 1234,
    };
    const cappedSTO = {
      type: 'CappedSTO',
      address: 'FakeCappedSTOAddress',
      ownerAddress: 'FakeCappedSTOOwnerAddress',
      description: 'CappedSTO Description',
      setupCost: 4567,
    };

    const action = stoModulesActions.update([usdTieredSTO, cappedSTO]);
    const result = reducer(undefined, action);

    const { address: usdTieredSTOAddress, ...usdTieredSTOState } = usdTieredSTO;
    const { address: cappedSTOAddress, ...cappedSTOState } = cappedSTO;

    expect(result).toEqual({
      [usdTieredSTOAddress]: usdTieredSTOState,
      [cappedSTOAddress]: cappedSTOState,
    });
  });
});
