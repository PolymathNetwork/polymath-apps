// @flow
import * as actions from '../actions/stoModules';
import type { STOModuleType } from '../constants';
import type { UpdateAction } from '../actions/stoModules';

export type STOModulesState = {
  [stoModuleType: STOModuleType]: {|
    name: string,
    ownerAddress: string,
    description: string,
    setupCost: number,
  |},
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
  }
};
