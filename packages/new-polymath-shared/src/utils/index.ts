import { Pojo, isPojo } from '~/typing/types';
import _ from 'lodash';

export const delay = async (amount: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, amount);
  });
};

/**
 * Returns a string hash of a POJO for comparison
 *
 * @param args arguments to hash
 */
export function hashObj(args: Pojo): string {
  const sortedKeyArray = _.keys(args).sort();

  return _.join(
    _.map(sortedKeyArray, key => {
      const val = args[key];
      let result;

      if (isPojo(val)) {
        result = hashObj(val);
      } else {
        result = `${args[key]}`;
      }

      return `${key}:${result}`;
    }),
    ','
  );
}
