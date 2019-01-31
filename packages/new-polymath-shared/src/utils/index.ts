import { saveAs } from 'file-saver';
import { parse, json2csv } from 'json2csv';
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

export const toEtherscanUrl = (
  value: string,
  { network, type = 'tx' }: { network?: string; type?: string } = {}
) => `https://${network ? network + '.' : ''}etherscan.io/${type}/${value}`;

export const downloadCsvFile = <T>(
  data: Readonly<T> | ReadonlyArray<T>,
  fileName: string,
  opts?: json2csv.Options<T>
) => {
  const csvOutput = parse(data, {
    ...opts,
  });

  const blob = new Blob([csvOutput], { type: 'text/csv' });

  saveAs(blob, fileName);
};
