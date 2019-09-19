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
  return value !== null && !moment(value).isValid();
}

function isInvalidNumber(value: number | null) {
  return isNaN(value) && value !== null;
}

function isInvalidBoolean(value: boolean | null) {
  return typeof value !== 'boolean' && value !== null;
}

function isInvalidRestrictionType(value) {
  return isNaN(value) && value !== null && (value !== 0 || value !== 1);
}

function isValidAllowedTokens(restrictionType, value) {
  return restrictionType === 1 && value > 0 && value < 100;
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
    const invalidDailyStartTime = isInvalidDate(row.dailyStartTime);
    const invalidDailyEndTime = isInvalidDate(row.dailyEndTime);
    const invalidDailyRestrictionType = isInvalidRestrictionType(
      row.dailyRestrictionType
    );
    const invalidDailyAllowedTokens = isInvalidNumber(row.dailyAllowedTokens);
    const invalidCustomStartTime = isInvalidDate(row.customStartTime);
    const invalidCustomEndTime = isInvalidDate(row.customEndTime);
    const invalidCustomRestrictionType = isInvalidRestrictionType(
      row.customRestrictionType
    );
    const invalidCustomAllowedTokens = isInvalidNumber(row.customAllowedTokens);
    const invalidRollingPeriodInDays = isInvalidNumber(row.rollingPeriodInDays);

    return (
      invalidAddress ||
      addressIsDuplicate ||
      invalidDailyStartTime ||
      invalidDailyEndTime ||
      invalidDailyRestrictionType ||
      invalidDailyAllowedTokens ||
      invalidCustomStartTime ||
      invalidCustomEndTime ||
      invalidCustomAllowedTokens ||
      invalidCustomRestrictionType ||
      invalidRollingPeriodInDays
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
    'ETH Address,24h Start Date,24h End Date,24h Restriction Type,24h Allowed Tokens,Custom Start Date,Custom End Date,Custom Restriction Type,Custom Allowed Tokens,Rolling Period In Days';
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
            return regex.test(value) && moment(value, 'M/D/YYYY').unix();
          }

          return value;
        },
        columns: line => {
          return [
            'address',
            'dailyStartTime',
            'dailyEndTime',
            'dailyRestrictionType',
            'dailyAllowedTokens',
            'customStartTime',
            'customEndTime',
            'customRestrictionType',
            'customAllowedTokens',
            'rollingPeriodInDays',
          ];
        },
      });
    } catch (error) {
      //Generate our own error message since this error is too much to output in a notification
      parseError = checkColumnCount(file);
    }
  }

  const invalidRows = validateWhitelistCsv(data);

  console.log(invalidRows);
  console.log(parseError);

  // Sanitization post-parsing.
  // Sometimes empty strings pass through for some reason
  const sanitizedData = map(data, row => {
    return reduce(
      row,
      (sanitized, rawValue, key) => {
        const value = rawValue === '' ? null : rawValue;
        sanitized[key] = value;
        switch (key) {
          case 'address':
            sanitized['id'] = sanitized[key];
            break;
          case 'dailyStartTime':
          case 'dailyEndTime':
          case 'customStartTime':
          case 'customEndTime':
            if (sanitized[key] === null) break;
            sanitized[key] = sanitized[key] * 1000;
            break;
        }
        if (sanitized[key] === null) delete sanitized[key];
        return sanitized;
      },
      {}
    );
  });
  console.log(sanitizedData);
  return { invalidRows, data: sanitizedData, parseError };
}
