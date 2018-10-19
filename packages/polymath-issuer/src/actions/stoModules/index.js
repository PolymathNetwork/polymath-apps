// @flow
import type { ExtractReturn } from '../../redux/helpers';
import type { STOModuleType } from '../../constants';
export const STO_MODULES_UPDATE = 'STO_MODULES_UPDATE';

type StoModulesUpdateParams = {|
  type: STOModuleType,
  description: string,
  setupCost: number,
  name: string,
|};

export const stoModulesUpdate = ({
  type,
  description,
  setupCost,
  name,
}: StoModulesUpdateParams) => ({
  type: STO_MODULES_UPDATE,
  payload: { moduleType: type, setupCost, description, name },
});

export type STOModulesUpdateAction = ExtractReturn<typeof stoModulesUpdate>;
