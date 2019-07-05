// eslint:disable
export const GeneralTransferManagerAbi = {
  contractName: 'GeneralTransferManager',
  abi: [
    {
      constant: true,
      inputs: [],
      name: 'allowAllBurnTransfers',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'WHITELIST',
      outputs: [
        {
          name: '',
          type: 'bytes32',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'allowAllWhitelistTransfers',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'unpause',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      name: 'investors',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'paused',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_amount',
          type: 'uint256',
        },
      ],
      name: 'takeFee',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'polyToken',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'pause',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'FLAGS',
      outputs: [
        {
          name: '',
          type: 'bytes32',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      name: 'whitelist',
      outputs: [
        {
          name: 'canSendAfter',
          type: 'uint64',
        },
        {
          name: 'canReceiveAfter',
          type: 'uint64',
        },
        {
          name: 'expiryTime',
          type: 'uint64',
        },
        {
          name: 'canBuyFromSTO',
          type: 'uint8',
        },
        {
          name: 'added',
          type: 'uint8',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'address',
        },
        {
          name: '',
          type: 'uint256',
        },
      ],
      name: 'nonceMap',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'allowAllTransfers',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'signingAddress',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'issuanceAddress',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'securityToken',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'factory',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'FEE_ADMIN',
      outputs: [
        {
          name: '',
          type: 'bytes32',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'allowAllWhitelistIssuances',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'defaults',
      outputs: [
        {
          name: 'canSendAfter',
          type: 'uint64',
        },
        {
          name: 'canReceiveAfter',
          type: 'uint64',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          name: '_securityToken',
          type: 'address',
        },
        {
          name: '_polyAddress',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_issuanceAddress',
          type: 'address',
        },
      ],
      name: 'ChangeIssuanceAddress',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_allowAllTransfers',
          type: 'bool',
        },
      ],
      name: 'AllowAllTransfers',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_allowAllWhitelistTransfers',
          type: 'bool',
        },
      ],
      name: 'AllowAllWhitelistTransfers',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_allowAllWhitelistIssuances',
          type: 'bool',
        },
      ],
      name: 'AllowAllWhitelistIssuances',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_allowAllBurnTransfers',
          type: 'bool',
        },
      ],
      name: 'AllowAllBurnTransfers',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_signingAddress',
          type: 'address',
        },
      ],
      name: 'ChangeSigningAddress',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_defaultCanSendAfter',
          type: 'uint64',
        },
        {
          indexed: false,
          name: '_defaultCanReceiveAfter',
          type: 'uint64',
        },
      ],
      name: 'ChangeDefaults',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_investor',
          type: 'address',
        },
        {
          indexed: false,
          name: '_dateAdded',
          type: 'uint256',
        },
        {
          indexed: true,
          name: '_addedBy',
          type: 'address',
        },
        {
          indexed: false,
          name: '_canSendAfter',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_canReceiveAfter',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_expiryTime',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_canBuyFromSTO',
          type: 'bool',
        },
      ],
      name: 'ModifyWhitelist',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_timestammp',
          type: 'uint256',
        },
      ],
      name: 'Pause',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_timestamp',
          type: 'uint256',
        },
      ],
      name: 'Unpause',
      type: 'event',
    },
    {
      constant: true,
      inputs: [],
      name: 'getInitFunction',
      outputs: [
        {
          name: '',
          type: 'bytes4',
        },
      ],
      payable: false,
      stateMutability: 'pure',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_defaultCanSendAfter',
          type: 'uint64',
        },
        {
          name: '_defaultCanReceiveAfter',
          type: 'uint64',
        },
      ],
      name: 'changeDefaults',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_issuanceAddress',
          type: 'address',
        },
      ],
      name: 'changeIssuanceAddress',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_signingAddress',
          type: 'address',
        },
      ],
      name: 'changeSigningAddress',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_allowAllTransfers',
          type: 'bool',
        },
      ],
      name: 'changeAllowAllTransfers',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_allowAllWhitelistTransfers',
          type: 'bool',
        },
      ],
      name: 'changeAllowAllWhitelistTransfers',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_allowAllWhitelistIssuances',
          type: 'bool',
        },
      ],
      name: 'changeAllowAllWhitelistIssuances',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_allowAllBurnTransfers',
          type: 'bool',
        },
      ],
      name: 'changeAllowAllBurnTransfers',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_from',
          type: 'address',
        },
        {
          name: '_to',
          type: 'address',
        },
        {
          name: '',
          type: 'uint256',
        },
        {
          name: '',
          type: 'bytes',
        },
        {
          name: '',
          type: 'bool',
        },
      ],
      name: 'verifyTransfer',
      outputs: [
        {
          name: '',
          type: 'uint8',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_investor',
          type: 'address',
        },
        {
          name: '_canSendAfter',
          type: 'uint256',
        },
        {
          name: '_canReceiveAfter',
          type: 'uint256',
        },
        {
          name: '_expiryTime',
          type: 'uint256',
        },
        {
          name: '_canBuyFromSTO',
          type: 'bool',
        },
      ],
      name: 'modifyWhitelist',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_investors',
          type: 'address[]',
        },
        {
          name: '_canSendAfters',
          type: 'uint256[]',
        },
        {
          name: '_canReceiveAfters',
          type: 'uint256[]',
        },
        {
          name: '_expiryTimes',
          type: 'uint256[]',
        },
        {
          name: '_canBuyFromSTO',
          type: 'bool[]',
        },
      ],
      name: 'modifyWhitelistMulti',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_investor',
          type: 'address',
        },
        {
          name: '_canSendAfter',
          type: 'uint256',
        },
        {
          name: '_canReceiveAfter',
          type: 'uint256',
        },
        {
          name: '_expiryTime',
          type: 'uint256',
        },
        {
          name: '_canBuyFromSTO',
          type: 'bool',
        },
        {
          name: '_validFrom',
          type: 'uint256',
        },
        {
          name: '_validTo',
          type: 'uint256',
        },
        {
          name: '_nonce',
          type: 'uint256',
        },
        {
          name: '_v',
          type: 'uint8',
        },
        {
          name: '_r',
          type: 'bytes32',
        },
        {
          name: '_s',
          type: 'bytes32',
        },
      ],
      name: 'modifyWhitelistSigned',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getInvestors',
      outputs: [
        {
          name: '',
          type: 'address[]',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getAllInvestorsData',
      outputs: [
        {
          name: '',
          type: 'address[]',
        },
        {
          name: '',
          type: 'uint256[]',
        },
        {
          name: '',
          type: 'uint256[]',
        },
        {
          name: '',
          type: 'uint256[]',
        },
        {
          name: '',
          type: 'bool[]',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_investors',
          type: 'address[]',
        },
      ],
      name: 'getInvestorsData',
      outputs: [
        {
          name: '',
          type: 'uint256[]',
        },
        {
          name: '',
          type: 'uint256[]',
        },
        {
          name: '',
          type: 'uint256[]',
        },
        {
          name: '',
          type: 'bool[]',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getPermissions',
      outputs: [
        {
          name: '',
          type: 'bytes32[]',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ],
};
