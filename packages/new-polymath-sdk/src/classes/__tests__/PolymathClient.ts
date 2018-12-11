import Web3 from 'web3';
import { HttpProvider } from 'web3/providers';

let provider: HttpProvider;

describe('PolymathClient', () => {
  beforeEach(() => {
    provider = new Web3.providers.HttpProvider('http://localhost:8545');
  });

  describe('.constructor', () => {
    test('sets up network params on construction', () => {});
  });

  describe('#connect', () => {
    test('initializes correctly after connecting', async () => {});
  });
});
