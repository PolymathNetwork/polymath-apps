import { types, utils } from '@polymathnetwork/new-shared';

export function serialize(entityType: string, pojo: types.Pojo) {
  const hashed = utils.hashObj(pojo);
  return `${entityType}:${Buffer.from(hashed).toString('base64')}`;
}
