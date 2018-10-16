import tickerRegistryArtifact from '../fixtures/contracts/TickerRegistry.json';
import { LOCAL_NETWORK_ID } from '../constants';

/**
 * DELETE THIS
 * - In local we want to use smart contracts' fixtures' addresses
 * - In staging we want to get staging kovan
 * - In mainnet we want to get production kovan + production mainnet
 */

const ORIGINAL_ENV = { ...process.env };

describe('constants', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  describe('NETWORK_ADDRESSES', () => {
    test('exports staging addresses in staging', () => {
      process.env.DEPLOYMENT_STAGE = 'staging';
      const constants = require('../constants');
      expect(constants.NETWORK_ADDRESSES).toEqual(constants._STAGING_ADDRESSES);
    });

    test('exports staging addresses in staging', () => {
      process.env.DEPLOYMENT_STAGE = 'production';
      const constants = require('../constants');
      expect(constants.NETWORK_ADDRESSES).toEqual(
        constants._PRODUCTION_ADDRESSES
      );
    });

    test('uses artifacts addresses in local stage', () => {
      process.env.DEPLOYMENT_STAGE = 'local';
      const constants = require('../constants');
      const addresses = constants.NETWORK_ADDRESSES;
      const tickerRegistryArtifactAddress =
        tickerRegistryArtifact.networks[LOCAL_NETWORK_ID].address;

      expect(addresses).toEqual(constants._LOCAL_ADDRESSES);
      expect(addresses[LOCAL_NETWORK_ID].TickerRegistry).toEqual(
        tickerRegistryArtifactAddress
      );
    });
  });

  describe('environment validations', () => {
    test('throws an error if environment variables are not valid', () => {
      delete process.env.DEPLOYMENT_STAGE;
      expect(() => {
        require('../constants');
      }).toThrowError();
    });
  });
});
