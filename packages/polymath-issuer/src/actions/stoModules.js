// @flow
import type { ExtractReturn } from '../redux/helpers';
import type { STOModuleType } from '../constants';
export const STO_MODULES_UPDATE = 'STO_MODULES_UPDATE';

type UpdateParams = {|
  type: STOModuleType,
  description: string,
  setupCost: number,
  name: string,
|};

export const update = ({
  type,
  description,
  setupCost,
  name,
}: UpdateParams) => ({
  type: STO_MODULES_UPDATE,
  payload: { moduleType: type, setupCost, description, name },
});

export type UpdateAction = ExtractReturn<typeof update>;
