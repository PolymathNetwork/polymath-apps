const { stripIndent } = require('common-tags');

const PolyTokenMethods = {
  allowance: 'Amount of allowance approved by an `owner` to a `spender`',
  balanceOf: 'Gets the total amount of tokens for an address',
  name: 'Name of the token',
  symbol: "Token's symbol (POLY)",
  totalSupply: 'Total amount of tokens that exist in the network',
  approve: 'Sets allowance for a `spender`',
  transfer: 'Transfers tokens to an address',
};

const TickerRegistryMethods = {
  expiryLimit: 'Amount of time in seconds a ticker can be reserved',
  getDetails: 'Gets the details of a ticker',
  registrationFee: 'Free in POLY required to register a ticker',
};

const CappedSTOFactoryMethods = {
  setupCost: 'The amount of POLY required to setup a token with this module',
};

const CountTransferManagerFactoryMethods = {
  setupCost: 'The amount of POLY required to setup a token with this module',
};

const CountTransferManagerMethods = {
  paused: 'Wether the module is paused or not',
  pause: 'Pauses the module',
  maxHolderCount: 'Maximum amount of tokens one person can hold',
  changeHolderCount: 'Sets the maximum amount of tokens one person can hold',
};

const PercentageTransferManagerMethods = {
  maxHolderPercentage: 'Gets the max percentage of tokens any address can hold',
  paused: 'Wether the module is paused or not',
  pause: 'Pauses the moduel',
  changeHolderPercentage:
    'Sets the maximum percent of the total tokens that one person can hold',
  modifyWhitelistMulti: 'Adds or removes the addresses in the whitelist',
  modifyWhitelist: 'Adds or removes an address from the whitelist',
};

const PercentageTransferManagerFactoryMethods = {
  setupCost: 'The amount of POLY required to setup a token with this module',
};

const SecurityTokenMethods = {
  allowance: 'Amount of allowance approved by an `owner` to a `spender`',
  balanceOf: 'Gets the total amount of tokens for an address',
  name: 'Name of the token',
  symbol: "Token's symbol (this is what was registered in the TickerRegistry)",
  totalSupply: 'Total amount of tokens that exist in the network',
  approve: 'Sets allowance for a `spender`',
  transfer: 'Transfers tokens to an address',
  getModuleByName: 'Gets a module attached to the token by name',
  mintMulti: 'Mints new tokens and assigns them to `_investors`',
  mint: 'Mints new tokens and assignes them to an `_investor` address',
  freeze: 'Freezes the token',
};

const SecurityTokenRegistryMethods = {
  registrationFee: 'The amount of POLY required to generate a Security Token',
  generateSecurityToken: 'Generates a security token',
};

const GeneralTransferManagerMethods = {
  paused: 'Wether the module is paused or not',
  pause: 'Pauses the moduel',
  modifyWhitelistMulti: 'Adds or removes the addresses in the whitelist',
  modifyWhitelist: 'Adds or removes an address from the whitelist',
};

const config = {
  contracts: {
    PolyToken: {
      description: stripIndent`
        The POLY token's smart contract. Implements the ERC20 interface
      `,
      methods: PolyTokenMethods,
    },
    TickerRegistry: {
      description: stripIndent`
        Keeps record of the tickers reserved by users
      `,
      methods: TickerRegistryMethods,
    },
    CappedSTOFactory: {
      description: stripIndent`
        Factory for [CappedSTO](#CappedSTO) STO module.
        Capped STOs set a limit on the total amount of funding an STO can raise.
      `,
      methods: CappedSTOFactoryMethods,
    },
    CountTransferManagerFactory: {
      description: stripIndent`
        Factory for [CountTransferManager](#CountTransferManager)
      `,
      methods: CountTransferManagerFactoryMethods,
    },
    CountTransferManager: {
      description: stripIndent`
        Limits the amount of tokens a given address
        can hold. It will prevent any transfer that violates the max amount
        of tokens an address can hold.
      `,
      methods: CountTransferManagerMethods,
    },
    // IModuleFactory: {},

    PercentageTransferManager: {
      description: stripIndent`
        Similar to [CountTransferManager](#CountTransferManager) except the
        limits are set in percentages.
        
        It also has a whitelist of addresses that
        can bypass the module's transfer validations
      `,
      methods: PercentageTransferManagerMethods,
    },
    PercentageTransferManagerFactory: {
      description: stripIndent`
        Factory for [PercentageTransferManager](#PercentageTransferManager)
      `,
      methods: PercentageTransferManagerFactoryMethods,
    },
    // GeneralPermissionManager: {},
    SecurityToken: {
      description: stripIndent`
        The security token smart contract. It defines the behavior of the
        Security Tokens created through Polymath.

        Only the token's owner and the attached STO module (if there is one) can
        mint tokens.
      `,
      methods: SecurityTokenMethods,
    },
    SecurityTokenRegistry: {
      description: stripIndent`
        Keeps track of all the Security Tokens that exist in the network.

        Through this contract Security Tokens can be created. It requires an
        allowance (of at least the registration fee) to be set to be able
        to create a Security Token
      `,
      methods: SecurityTokenRegistryMethods,
    },
    // CappedSTO: {},
    GeneralTransferManager: {
      methods: GeneralTransferManagerMethods,
    },
  },
};

module.exports = config;
