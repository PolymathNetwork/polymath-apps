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
  from?: Date,
  to?: Date,
  expiry?: Date,
  canBuyFromSTO?: boolean,
  bypassPercentageRestriction?: boolean,
  accredited?: boolean,
  nonAccreditedLimit?: BigNumberType,
};

const numericalRegex = /^-?\d+\.?\d*$/;

function isInvalidDate(value: any) {
  return value !== null && !moment(value).isValid();
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
    const invalidSellLockupDate = isInvalidDate(row.from);
    const invalidBuyLockupDate = isInvalidDate(row.to);
    const invalidKycAmlExpiryDate = isInvalidDate(row.expiry);
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
  const required_keywords =
    'ETH Address,Sell Restriction Date,Buy Restriction Date,KYC/AML Expiry Date,Can Buy From STO,Exempt From % Ownership';
  let errorMsg = false;
  const cells = required_keywords.split(',');
  for (let i = 0; i < cells.length; i++) {
    const result = header_row.includes(cells[i]);
    if (!result) {
      errorMsg =
        "The header row is missing or has misspelt the field '" +
        cells[i] +
        "'";
      break;
    }
  }
  return errorMsg;
};

// @TODO remove this entire function
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
            if (context.column === 'to' || context.column === 'from') {
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
            const regex = /\d\d?\/\d\d?\/\d{4}/;
            return regex.test(value) && moment(value, 'M/D/YYYY').toDate();
          }
          if (numericalRegex.test(value)) {
            return new BigNumber(value);
          }

          return value;
        },
        columns: line => {
          return [
            'address',
            'from',
            'to',
            'expiry',
            'canBuyFromSTO',
            'bypassPercentageRestriction',
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

  return { invalidRows, data, parseError };
}
