// @flow

import moment from 'moment';

const TRANSACTION_TIME_BUFFER = 20 * 60 * 1000;

const validateIndividualDays = function(value) {
  const startDate = this.parent.customDate.startDate;
  const endDate = this.parent.customDate.endDate;

  if (!startDate || !endDate) {
    return true;
  }

  const daysBetween = moment(endDate).diff(moment(startDate), 'days');

  if (value > daysBetween) {
    return this.createError({
      message: 'Your days cannot exceed the days between start and end date',
    });
  }

  return true;
};

const validateDays = function(value) {
  const startDate = this.parent.date.startDate;
  const endDate = this.parent.date.endDate;

  if (!startDate || !endDate) {
    return true;
  }

  const daysBetween = moment(endDate).diff(moment(startDate), 'days');

  if (value > daysBetween) {
    return this.createError({
      message: 'Your days cannot exceed the days between start and end date',
    });
  }

  return true;
};

const validateEndTime = function(value) {
  const startDate: Date = this.parent.startDate;
  const startTime: number = this.parent.startTime;
  const endDate: Date = this.parent.endDate;
  if (!startDate || !startTime || !endDate) {
    return true;
  }
  const startUnix = moment(startDate).unix() * 1000 + startTime;
  const endUnix = moment(endDate).unix() * 1000 + value;
  if (startUnix >= endUnix) {
    return this.createError({ message: 'End time must be after start time.' });
  }

  return true;
};

const validateEndDate = function(value) {
  const startDate: Date = this.parent.startDate;
  const valid = moment(value).isSameOrAfter(startDate);

  if (!valid) {
    return this.createError({ message: 'End date must be after start date.' });
  }
  return true;
};

const validateTodayOrAfter = function(value) {
  const valid = moment(value).isSameOrAfter(moment(Date.now()).startOf('day'));
  if (valid) {
    return true;
  }

  return this.createError({ message: 'Start time must be today or later.' });
};

const validateStartTime = function(value) {
  const startDate: Date = this.parent.startDate;

  if (!startDate) {
    return true;
  }

  const startUnix = moment(startDate).unix() * 1000 + value;
  const nowUnix = moment(Date.now()).unix() * 1000;
  const timeUntilStart = startUnix - nowUnix;

  if (nowUnix >= startUnix) {
    return this.createError({ message: 'Start time is in the past.' });
  }
  if (timeUntilStart < TRANSACTION_TIME_BUFFER) {
    return this.createError({
      message: 'Please allow for transaction processing time.',
    });
  }
  return true;
};

const REQUIRED_MESSAGE = 'Required.';
/* eslint-disable no-template-curly-in-string */
const MORE_THAN_MESSAGE = 'Must be higher than ${more}.';
const MIN_MESSAGE = 'Must be at least ${min}.';
const ADDRESS_MESSAGE = 'Invalid address.';
const MAX_DIGITS_MESSAGE = 'Cannot have more than ${maxDigits} digits.';
/* eslint-enable no-template-curly-in-string */

export {
  validateEndTime,
  validateDays,
  validateIndividualDays,
  validateEndDate,
  validateStartTime,
  validateTodayOrAfter,
  REQUIRED_MESSAGE,
  MORE_THAN_MESSAGE,
  MIN_MESSAGE,
  ADDRESS_MESSAGE,
  MAX_DIGITS_MESSAGE,
};
