import { isFSA } from 'flux-standard-action';
import * as actions from '../stoModules';

describe('Actions: stoModulesDetails', () => {
  describe('STO_MODULES_UPDATE', () => {
    test('returns expected action', () => {
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

      const expectedPayload = {
        stoModules: [usdTieredSTO, cappedSTO],
      };

      const result = actions.update([usdTieredSTO, cappedSTO]);
      expect(isFSA(result)).toEqual(true);
      expect(result.payload).toEqual(expectedPayload);
    });
  });
});
