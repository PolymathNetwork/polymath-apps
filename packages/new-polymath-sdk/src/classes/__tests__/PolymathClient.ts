import { PolymathClient } from '~/classes';
import Web3 from 'web3';
import { HttpProvider } from 'web3/providers';
import { Wallet } from '../Wallet';

let provider: HttpProvider;

describe('PolymathClient', () => {
  beforeEach(() => {
    provider = new Web3.providers.HttpProvider('http://localhost:8545');
  });

  describe('.constructor', () => {
    test('sets up network params on construction', () => {
      const client = new PolymathClient({ provider });
      expect(client.web3).toBeInstanceOf(Web3);
    });
  });

  describe('#connect', () => {
    test('initializes correctly after connecting', async () => {
      const client = new PolymathClient({ provider });
      await client.connect();
      expect(client.networkId).toBeDefined();
      expect(client.network).toBeDefined();
      expect(client.currentWallet).toBeInstanceOf(Wallet);
      const [account] = await client.web3.eth.getAccounts();
      expect(client.currentWallet.address).toEqual(account);
    });
  });
});
