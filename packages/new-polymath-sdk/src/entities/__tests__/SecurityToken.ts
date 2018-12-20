import { SecurityToken } from '../SecurityToken';
import { Polymath } from '../../Polymath';

const params = {
  symbol: 'TEST',
  name: 'Test Token',
};

const polyClient = {};

describe('SecurityToken', () => {
  describe('.constructor', () => {
    test('instanciates correctly', () => {
      const securityToken = new SecurityToken(params, polyClient);
      expect(securityToken).toBeDefined();
      expect(securityToken.name).toBeDefined();
      expect(securityToken.symbol).toBeDefined();
    });

    test('throws if polyClient is not passed', () => {
      expect(() => {
        const st = new SecurityToken(params);
      }).toThrow();
    });
  });

  describe('#createCheckpoint', () => {});
});
