import { types } from '~/index';

export enum NetworkIds {
  Local = 15,
  LocalVm = 16,
  Kovan = 42,
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
}

export const EtherscanSubdomains: {
  [key: number]: string;
} = {
  [NetworkIds.Kovan]: 'kovan',
  [NetworkIds.Ropsten]: 'ropsten',
  [NetworkIds.Mainnet]: '',
  [NetworkIds.Local]: 'localhost',
  [NetworkIds.LocalVm]: 'localhost',
};

const localTokens = {
  [types.Tokens.Dai]: '0xf12b5dd4ead5f743c6baa640b0216200e89b60da',
  [types.Tokens.Poly]: '0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0',
};

export const TokenAddresses = {
  [NetworkIds.Local]: localTokens,
  [NetworkIds.LocalVm]: localTokens,
  [NetworkIds.Kovan]: {
    [types.Tokens.Dai]: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',
    [types.Tokens.Poly]: '0xB347b9f5B56b431B2CF4e1d90a5995f7519ca792',
  },
  [NetworkIds.Mainnet]: {
    [types.Tokens.Dai]: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
    [types.Tokens.Poly]: '0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec',
    [types.Tokens.Gusd]: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
    [types.Tokens.Pax]: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
    [types.Tokens.Usdc]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    [types.Tokens.Usdt]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  [NetworkIds.Ropsten]: {
    [types.Tokens.Dai]: '0x0',
    [types.Tokens.Poly]: '0x0',
  },
  [NetworkIds.Rinkeby]: {
    [types.Tokens.Dai]: '0x0',
    [types.Tokens.Poly]: '0x0',
  },
};
