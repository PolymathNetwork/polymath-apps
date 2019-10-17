import { utils } from 'web3';

export const validateError = (headerName, value, rowNumber, columnNumber) => {
  return `Row ${rowNumber - 1}, ${headerName} value "${value}" is invalid`;
};

export const requiredError = (headerName, rowNumber, columnNumber) => {
  return `Row ${rowNumber - 1}, ${headerName} value is missing`;
};

export const headerError = headerName => {
  return `Header "${headerName}" is missing`;
};

export const uniqueError = headerName => {
  return `Column "${headerName}: duplicate values`;
};

export const validateDate = date => {
  const matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/.exec(date);
  if (matches == null) return false;
  const d = matches[2];
  const m = matches[1] - 1;
  const y = matches[3];
  const composedDate = new Date(y, m, d);
  return (
    composedDate.getDate() == d &&
    composedDate.getMonth() == m &&
    composedDate.getFullYear() == y
  );
};

export const validateAddress = val => {
  return (
    utils.isAddress(val) && val !== '0x0000000000000000000000000000000000000000'
  );
};
