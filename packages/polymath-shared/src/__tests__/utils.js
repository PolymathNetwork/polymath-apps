import { getAddressesByNetwork } from '../utils';

/**
 * DELETE THIS
 * - In local we want to use smart contracts' fixtures' addresses
 * - In staging we want to get staging kovan
 * - In mainnet we want to get production kovan + production mainnet
 */

const ORIGINAL_ENV = { ...process.env };

describe('utils', () => {
  beforeEach(() => {
    console.log(process.env.DEPLOYMENT_STAGE);
    console.log(process.env.NODE_ENV);
    jest.resetModules();
  });
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  describe('getAddressesByNetwork', () => {
    describe('not in local stage', () => {
      test('gets addresses from the NETWORKS constant', () => {});
    });

    describe('in local stage', () => {
      beforeEach(() => {
        process.env.DEPLOYMENT_STAGE = 'local';
      });
      test('gets addresses from json artifacts', () => {
        console.log(process.env.DEPLOYMENT_STAGE);
      });
    });
  });
});
