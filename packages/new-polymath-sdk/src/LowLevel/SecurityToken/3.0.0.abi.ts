export const SecurityTokenAbi = [
  {
    constant: true,
    inputs: [],
    name: 'name',
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
    constant: false,
    inputs: [
      {
        name: 'spender',
        type: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'approve',
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
    name: 'initialized',
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
    name: 'totalSupply',
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
    name: 'holderCount',
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
    name: 'getterDelegate',
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
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8',
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
        name: 'spender',
        type: 'address',
      },
      {
        name: 'addedValue',
        type: 'uint256',
      },
    ],
    name: 'increaseAllowance',
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
    name: 'currentCheckpointId',
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
    name: 'granularity',
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
    name: 'dataStore',
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
    name: 'UNLOCKED',
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
    constant: true,
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
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
    name: 'polymathRegistry',
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
    name: 'controllerDisabled',
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
    name: 'symbol',
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
    inputs: [],
    name: 'LOCKED',
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
    constant: false,
    inputs: [
      {
        name: 'spender',
        type: 'address',
      },
      {
        name: 'subtractedValue',
        type: 'uint256',
      },
    ],
    name: 'decreaseAllowance',
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
    name: '_owner',
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
    name: 'moduleRegistry',
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
    name: 'securityTokenRegistry',
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
    name: 'tokenDetails',
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
        name: 'owner',
        type: 'address',
      },
      {
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
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
    name: 'transfersFrozen',
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
    name: 'tokenFactory',
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
    name: 'controller',
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
    payable: true,
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_types',
        type: 'uint8[]',
      },
      {
        indexed: true,
        name: '_name',
        type: 'bytes32',
      },
      {
        indexed: true,
        name: '_moduleFactory',
        type: 'address',
      },
      {
        indexed: false,
        name: '_module',
        type: 'address',
      },
      {
        indexed: false,
        name: '_moduleCost',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_budget',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_label',
        type: 'bytes32',
      },
      {
        indexed: false,
        name: '_archived',
        type: 'bool',
      },
    ],
    name: 'ModuleAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_oldDetails',
        type: 'string',
      },
      {
        indexed: false,
        name: '_newDetails',
        type: 'string',
      },
    ],
    name: 'UpdateTokenDetails',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_oldName',
        type: 'string',
      },
      {
        indexed: false,
        name: '_newName',
        type: 'string',
      },
    ],
    name: 'UpdateTokenName',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_oldGranularity',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_newGranularity',
        type: 'uint256',
      },
    ],
    name: 'GranularityChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'FreezeIssuance',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_status',
        type: 'bool',
      },
    ],
    name: 'FreezeTransfers',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_checkpointId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_investorLength',
        type: 'uint256',
      },
    ],
    name: 'CheckpointCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_oldController',
        type: 'address',
      },
      {
        indexed: true,
        name: '_newController',
        type: 'address',
      },
    ],
    name: 'SetController',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_oldTreasuryWallet',
        type: 'address',
      },
      {
        indexed: false,
        name: '_newTreasuryWallet',
        type: 'address',
      },
    ],
    name: 'TreasuryWalletChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'DisableController',
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
        name: '_major',
        type: 'uint8',
      },
      {
        indexed: false,
        name: '_minor',
        type: 'uint8',
      },
      {
        indexed: false,
        name: '_patch',
        type: 'uint8',
      },
    ],
    name: 'TokenUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_types',
        type: 'uint8[]',
      },
      {
        indexed: false,
        name: '_module',
        type: 'address',
      },
    ],
    name: 'ModuleArchived',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_types',
        type: 'uint8[]',
      },
      {
        indexed: false,
        name: '_module',
        type: 'address',
      },
    ],
    name: 'ModuleUnarchived',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_types',
        type: 'uint8[]',
      },
      {
        indexed: false,
        name: '_module',
        type: 'address',
      },
    ],
    name: 'ModuleRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_moduleTypes',
        type: 'uint8[]',
      },
      {
        indexed: false,
        name: '_module',
        type: 'address',
      },
      {
        indexed: false,
        name: '_oldBudget',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_budget',
        type: 'uint256',
      },
    ],
    name: 'ModuleBudgetChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_fromPartition',
        type: 'bytes32',
      },
      {
        indexed: false,
        name: '_operator',
        type: 'address',
      },
      {
        indexed: true,
        name: '_from',
        type: 'address',
      },
      {
        indexed: true,
        name: '_to',
        type: 'address',
      },
      {
        indexed: false,
        name: '_value',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_data',
        type: 'bytes',
      },
      {
        indexed: false,
        name: '_operatorData',
        type: 'bytes',
      },
    ],
    name: 'TransferByPartition',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'operator',
        type: 'address',
      },
      {
        indexed: true,
        name: 'tokenHolder',
        type: 'address',
      },
    ],
    name: 'AuthorizedOperator',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'operator',
        type: 'address',
      },
      {
        indexed: true,
        name: 'tokenHolder',
        type: 'address',
      },
    ],
    name: 'RevokedOperator',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'partition',
        type: 'bytes32',
      },
      {
        indexed: true,
        name: 'operator',
        type: 'address',
      },
      {
        indexed: true,
        name: 'tokenHolder',
        type: 'address',
      },
    ],
    name: 'AuthorizedOperatorByPartition',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'partition',
        type: 'bytes32',
      },
      {
        indexed: true,
        name: 'operator',
        type: 'address',
      },
      {
        indexed: true,
        name: 'tokenHolder',
        type: 'address',
      },
    ],
    name: 'RevokedOperatorByPartition',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'partition',
        type: 'bytes32',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'IssuedByPartition',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'partition',
        type: 'bytes32',
      },
      {
        indexed: true,
        name: 'operator',
        type: 'address',
      },
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'data',
        type: 'bytes',
      },
      {
        indexed: false,
        name: 'operatorData',
        type: 'bytes',
      },
    ],
    name: 'RedeemedByPartition',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_controller',
        type: 'address',
      },
      {
        indexed: true,
        name: '_from',
        type: 'address',
      },
      {
        indexed: true,
        name: '_to',
        type: 'address',
      },
      {
        indexed: false,
        name: '_value',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_data',
        type: 'bytes',
      },
      {
        indexed: false,
        name: '_operatorData',
        type: 'bytes',
      },
    ],
    name: 'ControllerTransfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_controller',
        type: 'address',
      },
      {
        indexed: true,
        name: '_tokenHolder',
        type: 'address',
      },
      {
        indexed: false,
        name: '_value',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_data',
        type: 'bytes',
      },
      {
        indexed: false,
        name: '_operatorData',
        type: 'bytes',
      },
    ],
    name: 'ControllerRedemption',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_name',
        type: 'bytes32',
      },
      {
        indexed: false,
        name: '_uri',
        type: 'string',
      },
      {
        indexed: false,
        name: '_documentHash',
        type: 'bytes32',
      },
    ],
    name: 'DocumentRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_name',
        type: 'bytes32',
      },
      {
        indexed: false,
        name: '_uri',
        type: 'string',
      },
      {
        indexed: false,
        name: '_documentHash',
        type: 'bytes32',
      },
    ],
    name: 'DocumentUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_operator',
        type: 'address',
      },
      {
        indexed: true,
        name: '_to',
        type: 'address',
      },
      {
        indexed: false,
        name: '_value',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'Issued',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_operator',
        type: 'address',
      },
      {
        indexed: true,
        name: '_from',
        type: 'address',
      },
      {
        indexed: false,
        name: '_value',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'Redeemed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_getterDelegate',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_module',
        type: 'address',
      },
      {
        name: '_type',
        type: 'uint8',
      },
    ],
    name: 'isModule',
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
        name: '_moduleFactory',
        type: 'address',
      },
      {
        name: '_data',
        type: 'bytes',
      },
      {
        name: '_maxCost',
        type: 'uint256',
      },
      {
        name: '_budget',
        type: 'uint256',
      },
      {
        name: '_label',
        type: 'bytes32',
      },
      {
        name: '_archived',
        type: 'bool',
      },
    ],
    name: 'addModuleWithLabel',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_moduleFactory',
        type: 'address',
      },
      {
        name: '_data',
        type: 'bytes',
      },
      {
        name: '_maxCost',
        type: 'uint256',
      },
      {
        name: '_budget',
        type: 'uint256',
      },
      {
        name: '_archived',
        type: 'bool',
      },
    ],
    name: 'addModule',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_module',
        type: 'address',
      },
    ],
    name: 'archiveModule',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_module',
        type: 'address',
      },
    ],
    name: 'upgradeModule',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'upgradeToken',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_module',
        type: 'address',
      },
    ],
    name: 'unarchiveModule',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_module',
        type: 'address',
      },
    ],
    name: 'removeModule',
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
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'withdrawERC20',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_module',
        type: 'address',
      },
      {
        name: '_change',
        type: 'uint256',
      },
      {
        name: '_increase',
        type: 'bool',
      },
    ],
    name: 'changeModuleBudget',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_newTokenDetails',
        type: 'string',
      },
    ],
    name: 'updateTokenDetails',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_granularity',
        type: 'uint256',
      },
    ],
    name: 'changeGranularity',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_dataStore',
        type: 'address',
      },
    ],
    name: 'changeDataStore',
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
    ],
    name: 'changeName',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_wallet',
        type: 'address',
      },
    ],
    name: 'changeTreasuryWallet',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'freezeTransfers',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'unfreezeTransfers',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        name: 'success',
        type: 'bool',
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
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'transferWithData',
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
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
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
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'transferFromWithData',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_partition',
        type: 'bytes32',
      },
      {
        name: '_tokenHolder',
        type: 'address',
      },
    ],
    name: 'balanceOfByPartition',
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
    constant: false,
    inputs: [
      {
        name: '_partition',
        type: 'bytes32',
      },
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'transferByPartition',
    outputs: [
      {
        name: '',
        type: 'bytes32',
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
        name: '_operator',
        type: 'address',
      },
    ],
    name: 'authorizeOperator',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_operator',
        type: 'address',
      },
    ],
    name: 'revokeOperator',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_partition',
        type: 'bytes32',
      },
      {
        name: '_operator',
        type: 'address',
      },
    ],
    name: 'authorizeOperatorByPartition',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_partition',
        type: 'bytes32',
      },
      {
        name: '_operator',
        type: 'address',
      },
    ],
    name: 'revokeOperatorByPartition',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_partition',
        type: 'bytes32',
      },
      {
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
      {
        name: '_operatorData',
        type: 'bytes',
      },
    ],
    name: 'operatorTransferByPartition',
    outputs: [
      {
        name: '',
        type: 'bytes32',
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
        name: '_signature',
        type: 'bytes',
      },
    ],
    name: 'freezeIssuance',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenHolder',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'issue',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenHolders',
        type: 'address[]',
      },
      {
        name: '_values',
        type: 'uint256[]',
      },
    ],
    name: 'issueMulti',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_partition',
        type: 'bytes32',
      },
      {
        name: '_tokenHolder',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'issueByPartition',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'redeem',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_partition',
        type: 'bytes32',
      },
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'redeemByPartition',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_partition',
        type: 'bytes32',
      },
      {
        name: '_tokenHolder',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
      {
        name: '_operatorData',
        type: 'bytes',
      },
    ],
    name: 'operatorRedeemByPartition',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenHolder',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'redeemFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'createCheckpoint',
    outputs: [
      {
        name: '',
        type: 'uint256',
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
        name: '_controller',
        type: 'address',
      },
    ],
    name: 'setController',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_signature',
        type: 'bytes',
      },
    ],
    name: 'disableController',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'canTransfer',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
      {
        name: '',
        type: 'bytes1',
      },
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
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'canTransferFrom',
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
      {
        name: 'reasonCode',
        type: 'bytes1',
      },
      {
        name: 'appCode',
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
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_partition',
        type: 'bytes32',
      },
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'canTransferByPartition',
    outputs: [
      {
        name: 'esc',
        type: 'bytes1',
      },
      {
        name: 'appStatusCode',
        type: 'bytes32',
      },
      {
        name: 'toPartition',
        type: 'bytes32',
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
        type: 'bytes32',
      },
      {
        name: '_uri',
        type: 'string',
      },
      {
        name: '_documentHash',
        type: 'bytes32',
      },
    ],
    name: 'setDocument',
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
        type: 'bytes32',
      },
    ],
    name: 'removeDocument',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'isControllable',
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
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
      {
        name: '_operatorData',
        type: 'bytes',
      },
    ],
    name: 'controllerTransfer',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenHolder',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
      {
        name: '_operatorData',
        type: 'bytes',
      },
    ],
    name: 'controllerRedeem',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'updateFromRegistry',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
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
  {
    constant: true,
    inputs: [],
    name: 'isOwner',
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
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
