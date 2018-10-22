// @flow
import { getSTOModule } from '../utils/contracts';

import type { RootState } from '../redux/reducer';
import type { Dispatch } from 'redux';
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

export type FetchParams = {|
  type: STOModuleType,
|};
export const fetch = ({ type }: FetchParams) => {
  return async (
    dispatch: Dispatch<UpdateAction>,
    getState: () => RootState
  ) => {
    const { token } = getState();
    if (!token.token) {
      throw new Error(
        'Called stoModules.fetch action before having a security token in the state'
      );
    }

    console.log('Start');
    const moduleDetails = await getSTOModule(type, token.token.address);
    console.log('moduleDetails', moduleDetails);
    const { description, setupCost, name, ownerAddress } = moduleDetails;
    dispatch(update({ type, description, setupCost, name, ownerAddress }));
  };
};

export type UpdateAction = ExtractReturn<typeof update>;
