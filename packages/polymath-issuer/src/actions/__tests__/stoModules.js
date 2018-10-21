import { isFSA } from 'flux-standard-action';
import * as actions from '../stoModules';

describe('Actions: stoModulesDetails', () => {
  describe('STO_MODULES_UPDATE', () => {
    test('returns expected action', () => {
      const moduleDetails = {
        type: 'USDTieredSTO',
        description: 'description',
        name: 'name',
        setupCost: 123456789,
      };
      const expectedResult = {
        type: actions.STO_MODULES_UPDATE,
        payload: {
          moduleType: moduleDetails.type,
          description: moduleDetails.description,
          name: moduleDetails.name,
          setupCost: moduleDetails.setupCost,
        },
      };

      const result = actions.update(moduleDetails);
      expect(isFSA(result)).toEqual(true);
      expect(result).toEqual(expectedResult);
    });
  });
});
