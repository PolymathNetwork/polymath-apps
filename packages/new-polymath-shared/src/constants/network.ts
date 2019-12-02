import { types } from '~/index';

export enum NetworkIds {
  Local = 15,
  LocalVm = 16,
  Kovan = 42,
  Goerli = 5,
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
}

export const EtherscanSubdomains: {
  [key: number]: string;
} = {
  [NetworkIds.Kovan]: 'kovan',
  [NetworkIds.Goerli]: 'goerli',
  [NetworkIds.Ropsten]: 'ropsten',
  [NetworkIds.Mainnet]: '',
  [NetworkIds.Local]: 'localhost',
  [NetworkIds.LocalVm]: 'localhost',
};

const localTokens = {
  [types.Tokens.Dai]: '0xf12b5dd4ead5f743c6baa640b0216200e89b60da',
  [types.Tokens.Poly]: '0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0',
  [types.Tokens.Gusd]: '0xf12b5dd4ead5f743c6baa640b0216200e89b60da',
  [types.Tokens.Pax]: '0xf12b5dd4ead5f743c6baa640b0216200e89b60da',
  [types.Tokens.Usdc]: '0xf12b5dd4ead5f743c6baa640b0216200e89b60da',
  [types.Tokens.Usdt]: '0xf12b5dd4ead5f743c6baa640b0216200e89b60da',
};

export const TokenAddresses: {
  [networkId: string]: {
    [currency: string]: string;
  };
} = {
  [NetworkIds.Local]: localTokens,
  [NetworkIds.LocalVm]: localTokens,
  [NetworkIds.Kovan]: {
    [types.Tokens.Dai]: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
    [types.Tokens.Poly]: '0xB347b9f5B56b431B2CF4e1d90a5995f7519ca792',
    [types.Tokens.Gusd]: '0xB06d72a24df50D4E2cAC133B320c5E7DE3ef94cB',
    [types.Tokens.Pax]: '0xB06d72a24df50D4E2cAC133B320c5E7DE3ef94cB',
    [types.Tokens.Usdc]: '0xB06d72a24df50D4E2cAC133B320c5E7DE3ef94cB',
    [types.Tokens.Usdt]: '0xB06d72a24df50D4E2cAC133B320c5E7DE3ef94cB',
  },
  // Dai, USDT and Poly has a proper contract address. The rest are not deployed
  // to Goerli yet so we're using USDT address for them, instead.
  [NetworkIds.Goerli]: {
    [types.Tokens.Dai]: '0x73967c6a0904aa032c103b4104747e88c566b1a2',
    [types.Tokens.Poly]: '0x5af7f19575c1b0638994158e1137698701a18c67',
    [types.Tokens.Gusd]: '0x5af7f19575c1b0638994158e1137698701a18c67',
    [types.Tokens.Pax]: '0x5af7f19575c1b0638994158e1137698701a18c67',
    [types.Tokens.Usdc]: '0x5af7f19575c1b0638994158e1137698701a18c67',
    [types.Tokens.Usdt]: '0x509ee0d083ddf8ac028f2a56731412edd63223b9',
  },
  [NetworkIds.Mainnet]: {
    [types.Tokens.Dai]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
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
