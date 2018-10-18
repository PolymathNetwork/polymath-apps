import tickerRegistryArtifact from '../fixtures/contracts/TickerRegistry.json';
import { LOCAL_NETWORK_ID, KOVAN_NETWORK_ID } from '../constants';

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

    test('staging uses different addresses from production for kovan', () => {
      process.env.DEPLOYMENT_STAGE = 'staging';
      const stagingConstants = require('../constants');
      const stagingAddresses =
        stagingConstants.NETWORK_ADDRESSES[KOVAN_NETWORK_ID];

      jest.resetModules();

      process.env.DEPLOYMENT_STAGE = 'production';
      const productionConstants = require('../constants');
      const productionAddresses =
        productionConstants.NETWORK_ADDRESSES[KOVAN_NETWORK_ID];

      expect(productionAddresses).not.toEqual(stagingAddresses);
    });
  });

  describe('environment validations', () => {
    test('throws an error if environment variables are not valid', () => {
      delete process.env.DEPLOYMENT_STAGE;
      expect(() => {
        require('../constants');
      }).toThrowError();
    });

    test('throws an error if ambiguous deployment stage is set', () => {
      process.env.DEPLOYMENT_STAGE = 'local';
      process.env.REACT_APP_DEPLOYMENT_STAGE = 'local';
      expect(() => {
        require('../constants');
      }).toThrowError();
    });
  });
});
