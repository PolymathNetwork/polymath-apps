// @flow

import csvParse from 'csv-parse/lib/sync';
import moment from 'moment';
import { map, reduce, filter, each } from 'lodash';
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

function isInvalidNumber(value: number | null) {
  return isNaN(value) && value !== null;
}

function isInvalidBoolean(value: boolean | null) {
  return typeof value !== 'boolean' && value !== null;
}

// TODO @RafaelVidaurre: Have a better schema-based validation for csv parsers
export function validateWhitelistCsv(rows: WhitelistCsvRow[]) {
  const addressCounts = {};
  each(rows, ({ address }) => {
    if (web3.utils.isAddress(address)) {
      addressCounts[address] = addressCounts[address] || 0;
      addressCounts[address] += 1;
    }
  });

  const invalidRows = filter(rows, (row: WhitelistCsvRow) => {
    const invalidAddress = !web3.utils.isAddress(row.address);
    const addressIsDuplicate = addressCounts[row.address] > 1;
    const invalidBuyLockupDate = isInvalidDate(row.buyLockupDate);
    const invalidSellLockupDate = isInvalidDate(row.sellLockupDate);
    const invalidKycAmlExpiryDate = isInvalidDate(row.kycAmlExpiryDate);
    const invalidAccredited = isInvalidBoolean(row.accredited);
    const invalidNonAccreditedLimit = isInvalidNumber(row.nonAccreditedLimit);

    return (
      invalidAddress ||
      addressIsDuplicate ||
      invalidBuyLockupDate ||
      invalidSellLockupDate ||
      invalidKycAmlExpiryDate ||
      invalidNonAccreditedLimit ||
      invalidAccredited
    );
  });

  return invalidRows;
}

export function parseWhitelistCsv(file: string) {
  const data = csvParse(file, {
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    cast: (rawValue, context) => {
      const value = rawValue;

      if (value === '' || (typeof value === 'string' && !value.length)) {
        if (
          context.column === 'buyLockupDate' ||
          context.column === 'sellLockupDate'
        ) {
          return new Date(PERMANENT_LOCKUP_TS);
        }
        return null;
      }
      if (value.toLowerCase() === 'true') {
        return true;
      }
      if (value.toLowerCase() === 'false') {
        return false;
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

      console.log(context);

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

  // Sanitization post-parsing.
  // Sometimes empty strings pass through for some reason
  const sanitizedData = map(data, row => {
    return reduce(
      row,
      (sanitized, rawValue, key) => {
        const value = rawValue === '' ? null : rawValue;
        sanitized[key] = value;
        return sanitized;
      },
      {}
    );
  });

  return { invalidRows, data: sanitizedData };
}
