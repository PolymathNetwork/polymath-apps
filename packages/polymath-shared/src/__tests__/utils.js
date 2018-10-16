import { getAddressesByNetwork } from '../utils';

/**
 * DELETE THIS
 * - In local we want to use smart contracts' fixtures' addresses
 * - In staging we want to get staging kovan
 * - In mainnet we want to get production kovan + production mainnet
 */

describe('utils', () => {
  describe('getAddressesByNetwork', () => {
    describe('general', () => {
      test('gets addresses from the NETWORKS constant', () => {});
    });

    describe('in local stage', () => {
      test('gets addresses from json artifacts', () => {});
      test("returns the contractName's address", () => {});
    });

    describe('in non local-stage', () => {});
  });
});
