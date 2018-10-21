// @flow
import type { ExtractReturn } from '../redux/helpers';
import type { STOModuleType } from '../constants';
export const STO_MODULES_UPDATE = 'STO_MODULES_UPDATE';

type UpdateParams = {|
  type: STOModuleType,
  description: string,
  setupCost: number,
  name: string,
  ownerAddress: number,
|};

export const update = ({
  type,
  description,
  setupCost,
  name,
  ownerAddress,
}: UpdateParams) => ({
  type: STO_MODULES_UPDATE,
  payload: { moduleType: type, setupCost, description, name, ownerAddress },
});

export type UpdateAction = ExtractReturn<typeof update>;
