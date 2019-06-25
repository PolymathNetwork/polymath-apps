import stringify from 'json-stable-stringify';
import { isAddress } from '../LowLevel/utils';
import { Pojo } from '../types';

export const delay = async (amount: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, amount);
  });
};

export function serialize(entityType: string, pojo: Pojo) {
  return Buffer.from(`${entityType}:${stringify(pojo)}`).toString('base64');
}

export function unserialize(id: string) {
  const unserialized = Buffer.from(id, 'base64').toString('utf8');

  const matched = unserialized.match(/^.*?:(.*)/);

  const errorMsg = 'Wrong ID format.';

  if (!matched) {
    throw new Error(errorMsg);
  }

  const [, jsonString] = matched;

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    throw new Error(errorMsg);
  }
}

export function isValidAddress(address: string) {
  return isAddress(address);
}
