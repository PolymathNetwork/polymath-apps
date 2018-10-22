// @flow
import * as actions from '../actions/stoModules';
import type { STOModuleType } from '../constants';
import type { UpdateAction } from '../actions/stoModules';

export type STOModule = {|
  type: STOModuleType,
  name: string,
  ownerAddress: string,
  description: string,
  setupCost: number,
|};
export type STOModulesState = {
  [address: string]: STOModule,
};
const defaultState: STOModulesState = {};

export default (
  state: STOModulesState = defaultState,
  { type, payload }: UpdateAction
) => {
  switch (type) {
    case actions.STO_MODULES_UPDATE: {
      const { stoModules } = payload;
      const newState = {};
      stoModules.forEach(({ address, ...moduleData }) => {
        newState[address] = moduleData;
      });

      return newState;
    }
    default: {
      return state;
    }
  }
};
