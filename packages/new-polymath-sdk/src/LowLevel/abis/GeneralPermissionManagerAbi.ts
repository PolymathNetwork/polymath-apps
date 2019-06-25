// eslint:disable
export const GeneralPermissionManagerAbi = {
  contractName: 'GeneralPermissionManager',
  abi: [
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'address',
        },
        {
          name: '',
          type: 'address',
        },
        {
          name: '',
          type: 'bytes32',
        },
      ],
      name: 'perms',
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
      constant: true,
      inputs: [],
      name: 'CHANGE_PERMISSION',
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
          type: 'uint256',
        },
      ],
      name: 'allDelegates',
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
      inputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      name: 'delegateDetails',
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
          indexed: true,
          name: '_delegate',
          type: 'address',
        },
        {
          indexed: false,
          name: '_module',
          type: 'address',
        },
        {
          indexed: false,
          name: '_perm',
          type: 'bytes32',
        },
        {
          indexed: false,
          name: '_valid',
          type: 'bool',
        },
        {
          indexed: false,
          name: '_timestamp',
          type: 'uint256',
        },
      ],
      name: 'ChangePermission',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_delegate',
          type: 'address',
        },
        {
          indexed: false,
          name: '_details',
          type: 'bytes32',
        },
        {
          indexed: false,
          name: '_timestamp',
          type: 'uint256',
        },
      ],
      name: 'AddDelegate',
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
      constant: true,
      inputs: [
        {
          name: '_delegate',
          type: 'address',
        },
        {
          name: '_module',
          type: 'address',
        },
        {
          name: '_perm',
          type: 'bytes32',
        },
      ],
      name: 'checkPermission',
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
          name: '_delegate',
          type: 'address',
        },
        {
          name: '_details',
          type: 'bytes32',
        },
      ],
      name: 'addDelegate',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_delegate',
          type: 'address',
        },
      ],
      name: 'deleteDelegate',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_potentialDelegate',
          type: 'address',
        },
      ],
      name: 'checkDelegate',
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
          name: '_delegate',
          type: 'address',
        },
        {
          name: '_module',
          type: 'address',
        },
        {
          name: '_perm',
          type: 'bytes32',
        },
        {
          name: '_valid',
          type: 'bool',
        },
      ],
      name: 'changePermission',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_delegate',
          type: 'address',
        },
        {
          name: '_modules',
          type: 'address[]',
        },
        {
          name: '_perms',
          type: 'bytes32[]',
        },
        {
          name: '_valids',
          type: 'bool[]',
        },
      ],
      name: 'changePermissionMulti',
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
          name: '_perm',
          type: 'bytes32',
        },
      ],
      name: 'getAllDelegatesWithPerm',
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
          name: '_delegate',
          type: 'address',
        },
        {
          name: '_types',
          type: 'uint8[]',
        },
      ],
      name: 'getAllModulesAndPermsFromTypes',
      outputs: [
        {
          name: '',
          type: 'address[]',
        },
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
      inputs: [],
      name: 'getAllDelegates',
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
