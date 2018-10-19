// @flow

/**
 * Stores details about STOModulesDetails
 * Data to store:
 * - stoModule details
 * - loading state
 */
import * as actions from '../actions/stoModules';
import type { STOModuleType } from '../constants';
import type { STOModulesUpdateAction } from '../actions/stoModules';

export type STOModulesState = {
  [stoModuleType: STOModuleType]: {|
    name: string,
    ownerAddress: string,
    description: string,
  |},
};
const defaultState: STOModulesState = {};

export default (
  state: STOModulesState = defaultState,
  { type, payload }: STOModulesUpdateAction
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
