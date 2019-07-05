export * from './types';
export * from './entities';
export * from './utils';
export { Polymath } from './Polymath';
export { PolymathError } from './PolymathError';

let isNode = false;
if (typeof window === 'undefined') {
  isNode = true;
}

let browserUtils;
if (!isNode) {
  browserUtils = require('./browserUtils');
} else {
  browserUtils = null;
}

export { browserUtils };
