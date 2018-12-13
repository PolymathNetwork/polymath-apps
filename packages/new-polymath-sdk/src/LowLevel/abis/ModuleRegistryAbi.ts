// tslint:disable
export const ModuleRegistryAbi = {
  contractName: 'ModuleRegistry',
  abi: [
    {
      constant: true,
      inputs: [
        {
          name: '_variable',
          type: 'bytes32',
        },
      ],
      name: 'getBoolValues',
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
      name: 'getUintValues',
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
          name: '_variable',
          type: 'bytes32',
        },
      ],
      name: 'getStringValues',
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
          name: '_variable',
          type: 'bytes32',
        },
      ],
      name: 'getBytes32Values',
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
      name: 'getAddressValues',
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
          name: '_variable',
          type: 'bytes32',
        },
      ],
      name: 'getBytesValues',
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
      inputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor',
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
          indexed: true,
          name: '_moduleFactory',
          type: 'address',
        },
        {
          indexed: true,
          name: '_securityToken',
          type: 'address',
        },
      ],
      name: 'ModuleUsed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_moduleFactory',
          type: 'address',
        },
        {
          indexed: true,
          name: '_owner',
          type: 'address',
        },
      ],
      name: 'ModuleRegistered',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_moduleFactory',
          type: 'address',
        },
        {
          indexed: false,
          name: '_verified',
          type: 'bool',
        },
      ],
      name: 'ModuleVerified',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_moduleFactory',
          type: 'address',
        },
        {
          indexed: true,
          name: '_decisionMaker',
          type: 'address',
        },
      ],
      name: 'ModuleRemoved',
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
          name: '_moduleFactory',
          type: 'address',
        },
      ],
      name: 'useModule',
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
      ],
      name: 'registerModule',
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
          name: '_moduleFactory',
          type: 'address',
        },
        {
          name: '_verified',
          type: 'bool',
        },
      ],
      name: 'verifyModule',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_moduleType',
          type: 'uint8',
        },
        {
          name: '_securityToken',
          type: 'address',
        },
      ],
      name: 'getTagsByTypeAndToken',
      outputs: [
        {
          name: '',
          type: 'bytes32[]',
        },
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
          name: '_moduleType',
          type: 'uint8',
        },
      ],
      name: 'getTagsByType',
      outputs: [
        {
          name: '',
          type: 'bytes32[]',
        },
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
          name: '_factoryAddress',
          type: 'address',
        },
      ],
      name: 'getReputationByFactory',
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
          name: '_moduleType',
          type: 'uint8',
        },
      ],
      name: 'getModulesByType',
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
          name: '_moduleType',
          type: 'uint8',
        },
        {
          name: '_securityToken',
          type: 'address',
        },
      ],
      name: 'getModulesByTypeAndToken',
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
  ],
};
