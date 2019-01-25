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

const checkColumnCount = data => {
  // Split the input into lines
  let rows = data.split('\n');
  const header_row = rows[0].split(',');
  let errorMsg;
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].split(',');
    if (cells.length !== header_row.length) {
      errorMsg = 'The number of columns is incorrect on row ' + i;
      break;
    }
  }
  return errorMsg;
};

const checkCSVHeaders = data => {
  // Split the input into lines
  let rows = data.split('\n');
  const header_row = rows[0].split(',');
  const default_headers =
    'Address,Sale Lockup,Purchase Lockup,KYC/AML Expiry,Can Buy From STO,Exempt From % Ownership';
  let errorMsg = false;
  const cells = default_headers.split(',');
  for (let i = 1; i < cells.length; i++) {
    const result = header_row.includes(cells[i]);
    if (!result) {
      errorMsg = 'The header row is missing fields';
      break;
    }
  }
  return errorMsg;
};

export function parseWhitelistCsv(file: string) {
  let data;
  let parseError = checkCSVHeaders(file);
  if (!parseError) {
    try {
      data = csvParse(file, {
        skip_empty_lines: true,
        trim: true,
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
    } catch (error) {
      //Generate our own error message since this error is too much to output in a notification
      parseError = checkColumnCount(file);
    }
  }

  const invalidRows = validateWhitelistCsv(data);
  console.log(data);

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

  return { invalidRows, data: sanitizedData, parseError };
}
