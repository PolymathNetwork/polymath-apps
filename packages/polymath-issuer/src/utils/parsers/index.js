// @flow

import csvParse from 'csv-parse/lib/sync';
import moment from 'moment';
import { filter, each } from 'lodash';
import web3 from 'web3';
import BigNumber from 'bignumber.js';

import type { BigNumberType } from 'bignumber.js';

const PERMANENT_LOCKUP_TS = 67184812800000;

type WhitelistCsvRow = {
  address: string,
  sellLockupDate?: Date,
  buyLockupDate?: Date,
  kycAmlExpiryDate?: Date,
  canBuyFromSto?: boolean,
  bypassesOwnershipRestriction?: boolean,
  accredited?: boolean,
  nonAccreditedLimit?: BigNumberType,
};

const numericalRegex = /^-?\d+\.?\d*$/;

function isInvalidDate(value: any) {
  return value !== null && !moment.isDate(value);
}

export function validateWhitelistCsv(rows: WhitelistCsvRow[]) {
  const addressCounts = {};
  each(rows, ({ address }) => {
    if (web3.utils.isAddress(address)) {
      addressCounts[address] = addressCounts[address] || 0;
      addressCounts[address] += 1;
    }
  });

  const invalidRows = filter(rows, (row: WhitelistCsvRow) => {
    const addressIsInvalid = !web3.utils.isAddress(row.address);
    const addressIsDuplicate = addressCounts[row.address] > 1;
    const buyLockupDateIsInvalid = isInvalidDate(row.buyLockupDate);
    const sellLockupDateIsInvalid = isInvalidDate(row.sellLockupDate);
    const kycAmlExpiryDateIsInvalid = isInvalidDate(row.kycAmlExpiryDate);

    return (
      addressIsInvalid ||
      addressIsDuplicate ||
      buyLockupDateIsInvalid ||
      sellLockupDateIsInvalid ||
      kycAmlExpiryDateIsInvalid
    );
  });

  return invalidRows;
}

export function parseWhitelistCsv(file: string) {
  const data = csvParse(file, {
    cast: (value, context) => {
      if (value === '') {
        if (
          context.column === 'buyLockupDate' ||
          context.column === 'sellLockupDate'
        ) {
          return new Date(PERMANENT_LOCKUP_TS);
        }
        return null;
      }
      if (value.toLocaleLowerCase() === 'true') {
        return true;
      }
      if (value.split('/').length === 3) {
        const [rawMonth, day, rawYear] = value.split('/');
        // Months are 0-based
        const month = parseInt(rawMonth, 10) - 1;
        let year = parseInt(rawYear, 10);

        // Support for incomplete years
        if (year < 2000) {
          year += 2000;
        }
        return moment({ month, day, year }).toDate();
      }
      if (numericalRegex.test(value)) {
        return new BigNumber(value);
      }

      return value;
    },
    columns: line => {
      return [
        'address',
        'sellLockupDate',
        'buyLockupDate',
        'kycAmlExpiryDate',
        'canBuyFromSto',
        'bypassesOwnershipRestriction',
        'accredited',
        'nonAccreditedLimit',
      ];
    },
  });

  const invalidRows = validateWhitelistCsv(data);

  return { invalidRows, data };
}
