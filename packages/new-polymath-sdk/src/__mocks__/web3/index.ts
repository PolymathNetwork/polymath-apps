// tslint:disable
import Web3 from 'web3';

class HttpProviderMock {
  constructor(url: string) {}
}

export default class Web3Mock {
  public eth = {
    net: {
      getId: jest.fn(() => '15'),
    },
    getAccounts: jest.fn(() => ['0x123456789']),
  };
  static providers = {
    ...Web3.providers,
    HttpProvider: HttpProviderMock,
  };
}
