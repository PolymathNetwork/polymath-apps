import { types, utils } from '@polymathnetwork/new-shared';
import { isAddress } from '~/LowLevel/utils';

export function serialize(entityType: string, pojo: types.Pojo) {
  const hashed = utils.hashObj(pojo);
  return `${entityType}:${Buffer.from(hashed).toString('base64')}`;
}

export function isValidAddress(address: string) {
  return isAddress(address);
}
