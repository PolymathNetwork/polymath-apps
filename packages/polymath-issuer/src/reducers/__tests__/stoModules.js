import reducer from '../stoModules';
import * as stoModulesActions from '../../actions/stoModules';

describe('Reducer: stoModules', () => {
  test('on STO_MODULES_UPDATE', () => {
    const type = 'USDTieredSTO';
    const description = 'description';
    const name = 'STO Name';
    const setupCost = 1234;
    const action = stoModulesActions.update({
      type,
      description,
      name,
      setupCost,
    });
    const result = reducer(undefined, action);
    const { moduleType, ...rest } = action.payload;

    expect(result).toEqual({
      [moduleType]: {
        ...rest,
      },
    });
  });
});
