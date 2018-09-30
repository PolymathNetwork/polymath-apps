const { stripIndent } = require('common-tags');

const PolyTokenMethods = {
  allowance: 'Amount of allowance approved by an `owner` to a `spender`',
  balanceOf: 'Gets the total amount of tokens for an address',
  name: 'Name of the token',
  symbol: "Token's symbol (POLY)",
  totalSupply: 'Total amount of tokens that exist in the network',
};

const config = {
  contracts: {
    PolyToken: {
      description: stripIndent`
        The POLY token's smart contract. Implements the ERC20 interface
      `,
      methods: PolyTokenMethods,
    },
    TickerRegistry: {},
    CappedSTOFactory: {},
    CountTransferManagerFactory: {},
    CountTransferManager: {},
    IModuleFactory: {},
    PercentageTransferManager: {},
    PercentageTransferManagerFactory: {},
    GeneralPermissionManager: {},
    SecurityToken: {},
    SecurityTokenRegistry: {},
    CappedSTO: {},
    GeneralTransferManager: {},
  },
};

module.exports = config;
