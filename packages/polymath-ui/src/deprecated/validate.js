/* eslint-disable import/extensions, import/no-unresolved */
// @flow
// $FlowFixMe
import Web3 from 'web3';
import type { TwelveHourTime } from './deprecated/components/inputs/TimePickerInput';

const web3 = new Web3();

export const required = (value: any) => {
  return value !== null && value !== undefined && value !== ''
    ? null
    : 'Required.';
};

export const maxLength = (max: number) => (value: ?string) =>
  value && value.length > max ? `Must be ${max} characters or fewer.` : null;

export const minLength = (min: number) => (value: ?string) =>
  value && value.length < min ? `Must be ${min} characters or more.` : null;

export const number = (value: any) =>
  value && Number.isNaN(Number(value)) ? 'Must be a number.' : null;

export const minValue = (min: number) => (value: ?number) =>
  value && value < min ? `Must be at least ${min}.` : null;

export const maxValue = (max: number) => (value: ?number) =>
  value && value > max ? `Must be ${max} or less.` : null;

export const gt = (x: number) => (value: ?number) =>
  value && value <= x ? `Must be greater than ${x}.` : null;

export const alphanumeric = (value: ?string) =>
  value && !/^[a-z0-9]+$/i.test(value)
    ? 'Only alphanumeric symbols are allowed.'
    : null;

export const regex = (
  expr: RegExp,
  value: ?string,
  message: string = 'Invalid characters.'
) => (value && !expr.test(value) ? message : null);

export const email = (value: ?string) =>
  value && !/^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z0-9-]+$/i.test(value)
    ? 'Invalid email address.'
    : null;

export const url = (value: ?string) =>
  value &&
  !/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[-a-zA-Z0-9@:%._+~#=]{2,256}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i.test(
    value
  )
    ? 'Invalid URL (example: http(s)://www.example.com).'
    : null;

export const integer = (value: ?number) => {
  if (!value) {
    return null;
  }
  const v = Number(value);
  return Number.isNaN(v) || v % 1 !== 0 ? 'Must be a whole number.' : null;
};

export const float = (value: string) => {
  if (!value) {
    return null;
  }
  return !/^[+-]?\d+(\.\d+)?$/.test(value) ? 'Must be a float number.' : null;
};

export const ethereumAddress = (value: ?string) => {
  return web3.utils.isAddress(value)
    ? null
    : 'Must be a valid Ethereum address.';
};

export const date = (value: any) =>
  value instanceof Date ? null : 'Pick date from the calendar.';

export const dateRange = (value: any) => {
  if (!value) {
    return null;
  }
  if (
    !(value instanceof Array) ||
    value.length !== 2 ||
    !(value[0] instanceof Date) ||
    !(value[1] instanceof Date)
  ) {
    return 'Pick dates from the calendar.';
  }
  return null;
};

export const laterThan = (x: Date, value: Date, label: string) =>
  value && x && value.getTime() > x.getTime()
    ? null
    : `Must be later than ${label}.`;

export const todayOrLater = (date: ?Date): ?string => {
  if (!date) {
    return null;
  }

  // eslint-disable-next-line
  date = new Date(date);

  const now = new Date();
  const dayBegin = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (dayBegin.getTime() > date.getTime()) {
    return 'Date is in the past.';
  }

  return null;
};

export const tomorrowOrLater = (date: ?Date): ?string => {
  if (!date) {
    return null;
  }

  // eslint-disable-next-line
  date = new Date(date);

  const now = new Date();
  now.setDate(now.getDate() + 1);
  const dayBegin = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (dayBegin.getTime() > date.getTime()) {
    return 'Date is in the past.';
  }

  return null;
};

export const dateRangeTodayOrLater = (value: [Date, Date]): ?string => {
  return todayOrLater(value[0]) || todayOrLater(value[1]);
};

export const twelveHourTime = (value: ?TwelveHourTime) => {
  if (!value || !value.timeString) {
    return 'Required.';
  }

  const regex = /^([01]?[0-9]):([012345][0-9])$/;
  const match = regex.exec(value.timeString);

  if (match) {
    const hours = parseInt(match[1]);
    if (hours > 0 && hours <= 12) {
      return null;
    }
  }

  return 'Invalid time.';
};

export const numeric = (value: ?string) => {
  return value && !/^\d{1,3}(,?\d{3})*?(.\d{2})?$/g.test(value)
    ? 'Must be a whole number.'
    : null;
};
