// @flow
import * as actions from '../actions/stoModules';
import type { STOModule } from '../constants';

import type { UpdateAction } from '../actions/stoModules';
export type STOModulesState = {
  fetched: boolean,
  modules: {
    [address: string]: STOModule,
  },
};
const defaultState: STOModulesState = {
  fetched: false,
  modules: {},
};

export default (
  state: STOModulesState = defaultState,
  { type, payload }: UpdateAction
) => {
  switch (type) {
    case actions.STO_MODULES_UPDATE: {
      const { stoModules } = payload;
      const modules = {};
      stoModules.forEach(stoModuleData => {
        modules[stoModuleData.address] = stoModuleData;
      });

      return { ...state, modules, fetched: true };
    }
    default: {
      return state;
    }
  }
};
