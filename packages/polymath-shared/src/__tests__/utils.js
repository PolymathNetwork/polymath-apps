import { getAddressesByNetwork } from '../utils';

/**
 * DELETE THIS
 * - In local we want to use smart contracts' fixtures' addresses
 * - In staging we want to get staging kovan
 * - In mainnet we want to get production kovan + production mainnet
 */

const ORIGINAL_ENV = process.env;

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

describe('utils', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('getAddressesByNetwork', () => {
    describe('not in local stage', () => {
      beforeEach(() => {
        process.env.DEPLOYMENT_STAGE = 'local';
      });

      test('gets addresses from the NETWORKS constant', () => {
        console.log(process.env.DEPLOYMENT_STAGE);
      });
    });

    describe('in local stage', () => {
      test('gets addresses from json artifacts', () => {
        console.log(process.env.DEPLOYMENT_STAGE);
      });
    });
  });
});
