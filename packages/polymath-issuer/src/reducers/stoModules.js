// @flow
import * as actions from '../actions/stoModules';
import type { STOModuleType } from '../constants';
import type { UpdateAction } from '../actions/stoModules';

export type STOModule = {|
  name: string,
  ownerAddress: string,
  description: string,
  setupCost: number,
|};
export type STOModulesState = {
  [stoModuleType: STOModuleType]: STOModule,
};
const defaultState: STOModulesState = {};

export default (
  state: STOModulesState = defaultState,
  { type, payload }: UpdateAction
) => {
  switch (type) {
    case actions.STO_MODULES_UPDATE: {
      const { moduleType, ...rest } = payload;
      const stoModuleState = state[moduleType];
      return {
        ...state,
        [moduleType]: {
          ...stoModuleState,
          ...rest,
        },
      };
    }
    default: {
      return state;
    }
  }
};
