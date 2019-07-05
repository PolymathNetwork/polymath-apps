export const SecurityTokenRegistryAbi = [
  {
    constant: true,
    inputs: [
      {
        name: '_variable',
        type: 'bytes32',
      },
    ],
    name: 'getBytes32Value',
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
        name: '_variable',
        type: 'bytes32',
      },
    ],
    name: 'getBytesValue',
    outputs: [
      {
        name: '',
        type: 'bytes',
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
        name: '_variable',
        type: 'bytes32',
      },
    ],
    name: 'getAddressValue',
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
    inputs: [
      {
        name: '_key',
        type: 'bytes32',
      },
    ],
    name: 'getArrayAddress',
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
    inputs: [
      {
        name: '_variable',
        type: 'bytes32',
      },
    ],
    name: 'getBoolValue',
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
    inputs: [
      {
        name: '_variable',
        type: 'bytes32',
      },
    ],
    name: 'getStringValue',
    outputs: [
      {
        name: '',
        type: 'string',
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
        name: '_key',
        type: 'bytes32',
      },
    ],
    name: 'getArrayBytes32',
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
  {
    constant: true,
    inputs: [
      {
        name: '_variable',
        type: 'bytes32',
      },
    ],
    name: 'getUintValue',
    outputs: [
      {
        name: '',
        type: 'uint256',
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
        name: '_key',
        type: 'bytes32',
      },
    ],
    name: 'getArrayUint',
    outputs: [
      {
        name: '',
        type: 'uint256[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_ticker',
        type: 'string',
      },
      {
        indexed: false,
        name: '_removedAt',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_removedBy',
        type: 'address',
      },
    ],
    name: 'TickerRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_oldExpiry',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_newExpiry',
        type: 'uint256',
      },
    ],
    name: 'ChangeExpiryLimit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_oldFee',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_newFee',
        type: 'uint256',
      },
    ],
    name: 'ChangeSecurityLaunchFee',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_oldFee',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_newFee',
        type: 'uint256',
      },
    ],
    name: 'ChangeTickerRegistrationFee',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_ticker',
        type: 'string',
      },
      {
        indexed: true,
        name: '_oldOwner',
        type: 'address',
      },
      {
        indexed: true,
        name: '_newOwner',
        type: 'address',
      },
    ],
    name: 'ChangeTickerOwnership',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_ticker',
        type: 'string',
      },
      {
        indexed: false,
        name: '_name',
        type: 'string',
      },
      {
        indexed: true,
        name: '_securityTokenAddress',
        type: 'address',
      },
      {
        indexed: true,
        name: '_owner',
        type: 'address',
      },
      {
        indexed: false,
        name: '_addedAt',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_registrant',
        type: 'address',
      },
      {
        indexed: false,
        name: '_fromAdmin',
        type: 'bool',
      },
      {
        indexed: false,
        name: '_registrationFee',
        type: 'uint256',
      },
    ],
    name: 'NewSecurityToken',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_owner',
        type: 'address',
      },
      {
        indexed: false,
        name: '_ticker',
        type: 'string',
      },
      {
        indexed: false,
        name: '_name',
        type: 'string',
      },
      {
        indexed: true,
        name: '_registrationDate',
        type: 'uint256',
      },
      {
        indexed: true,
        name: '_expiryDate',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_fromAdmin',
        type: 'bool',
      },
      {
        indexed: false,
        name: '_registrationFee',
        type: 'uint256',
      },
    ],
    name: 'RegisterTicker',
    type: 'event',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_polymathRegistry',
        type: 'address',
      },
      {
        name: '_STFactory',
        type: 'address',
      },
      {
        name: '_stLaunchFee',
        type: 'uint256',
      },
      {
        name: '_tickerRegFee',
        type: 'uint256',
      },
      {
        name: '_polyToken',
        type: 'address',
      },
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_ticker',
        type: 'string',
      },
      {
        name: '_tokenName',
        type: 'string',
      },
    ],
    name: 'registerTicker',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_ticker',
        type: 'string',
      },
      {
        name: '_tokenName',
        type: 'string',
      },
      {
        name: '_registrationDate',
        type: 'uint256',
      },
      {
        name: '_expiryDate',
        type: 'uint256',
      },
      {
        name: '_status',
        type: 'bool',
      },
    ],
    name: 'modifyTicker',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_ticker',
        type: 'string',
      },
    ],
    name: 'removeTicker',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_newOwner',
        type: 'address',
      },
      {
        name: '_ticker',
        type: 'string',
      },
    ],
    name: 'transferTickerOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_newExpiry',
        type: 'uint256',
      },
    ],
    name: 'changeExpiryLimit',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'getTickersByOwner',
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
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'getTokensByOwner',
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
    inputs: [
      {
        name: '_ticker',
        type: 'string',
      },
    ],
    name: 'getTickerDetails',
    outputs: [
      {
        name: '',
        type: 'address',
      },
      {
        name: '',
        type: 'uint256',
      },
      {
        name: '',
        type: 'uint256',
      },
      {
        name: '',
        type: 'string',
      },
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
        name: '_name',
        type: 'string',
      },
      {
        name: '_ticker',
        type: 'string',
      },
      {
        name: '_tokenDetails',
        type: 'string',
      },
      {
        name: '_divisible',
        type: 'bool',
      },
    ],
    name: 'generateSecurityToken',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_name',
        type: 'string',
      },
      {
        name: '_ticker',
        type: 'string',
      },
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_securityToken',
        type: 'address',
      },
      {
        name: '_tokenDetails',
        type: 'string',
      },
      {
        name: '_deployedAt',
        type: 'uint256',
      },
    ],
    name: 'modifySecurityToken',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_securityToken',
        type: 'address',
      },
    ],
    name: 'isSecurityToken',
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
    inputs: [
      {
        name: '_ticker',
        type: 'string',
      },
    ],
    name: 'getSecurityTokenAddress',
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
    inputs: [
      {
        name: '_securityToken',
        type: 'address',
      },
    ],
    name: 'getSecurityTokenData',
    outputs: [
      {
        name: '',
        type: 'string',
      },
      {
        name: '',
        type: 'address',
      },
      {
        name: '',
        type: 'string',
      },
      {
        name: '',
        type: 'uint256',
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
        name: '_newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
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
    constant: false,
    inputs: [],
    name: 'unpause',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tickerRegFee',
        type: 'uint256',
      },
    ],
    name: 'changeTickerRegistrationFee',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_stLaunchFee',
        type: 'uint256',
      },
    ],
    name: 'changeSecurityLaunchFee',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenContract',
        type: 'address',
      },
    ],
    name: 'reclaimERC20',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_STFactoryAddress',
        type: 'address',
      },
      {
        name: '_major',
        type: 'uint8',
      },
      {
        name: '_minor',
        type: 'uint8',
      },
      {
        name: '_patch',
        type: 'uint8',
      },
    ],
    name: 'setProtocolVersion',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getSTFactoryAddress',
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
    name: 'getProtocolVersion',
    outputs: [
      {
        name: '',
        type: 'uint8[]',
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
        name: '_newAddress',
        type: 'address',
      },
    ],
    name: 'updatePolyTokenAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getSecurityTokenLaunchFee',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getTickerRegistrationFee',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getExpiryLimit',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'isPaused',
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
    name: 'owner',
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
];
