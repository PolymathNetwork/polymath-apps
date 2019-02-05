// tslint:disable
export const ModuleFactoryAbi = {
  contractName: 'ModuleFactory',
  abi: [
    {
      constant: false,
      inputs: [
        {
          name: '_data',
          type: 'bytes',
        },
      ],
      name: 'deploy',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'monthlySubscriptionCost',
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
      name: 'name',
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
      name: 'title',
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
      name: 'version',
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
      name: 'renounceOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'description',
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
      name: 'setupCost',
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
      name: 'getTags',
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
      inputs: [],
      name: 'getTypes',
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
      constant: true,
      inputs: [],
      name: 'usageCost',
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
      name: 'getInstructions',
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
      inputs: [
        {
          name: '_polyAddress',
          type: 'address',
        },
        {
          name: '_setupCost',
          type: 'uint256',
        },
        {
          name: '_usageCost',
          type: 'uint256',
        },
        {
          name: '_subscriptionCost',
          type: 'uint256',
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
          name: 'previousOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipRenounced',
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
          name: '_oldSetupCost',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_newSetupCost',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_moduleFactory',
          type: 'address',
        },
      ],
      name: 'ChangeFactorySetupFee',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_oldUsageCost',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_newUsageCost',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_moduleFactory',
          type: 'address',
        },
      ],
      name: 'ChangeFactoryUsageFee',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_oldSubscriptionCost',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_newMonthlySubscriptionCost',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_moduleFactory',
          type: 'address',
        },
      ],
      name: 'ChangeFactorySubscriptionFee',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_module',
          type: 'address',
        },
        {
          indexed: true,
          name: '_moduleName',
          type: 'bytes32',
        },
        {
          indexed: true,
          name: '_moduleFactory',
          type: 'address',
        },
        {
          indexed: false,
          name: '_creator',
          type: 'address',
        },
        {
          indexed: false,
          name: '_setupCost',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_timestamp',
          type: 'uint256',
        },
      ],
      name: 'GenerateModuleFromFactory',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_boundType',
          type: 'string',
        },
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
      name: 'ChangeSTVersionBound',
      type: 'event',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_newSetupCost',
          type: 'uint256',
        },
      ],
      name: 'changeFactorySetupFee',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_newUsageCost',
          type: 'uint256',
        },
      ],
      name: 'changeFactoryUsageFee',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_newSubscriptionCost',
          type: 'uint256',
        },
      ],
      name: 'changeFactorySubscriptionFee',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_newTitle',
          type: 'string',
        },
      ],
      name: 'changeTitle',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_newDesc',
          type: 'string',
        },
      ],
      name: 'changeDescription',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_newName',
          type: 'bytes32',
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
          name: '_newVersion',
          type: 'string',
        },
      ],
      name: 'changeVersion',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_boundType',
          type: 'string',
        },
        {
          name: '_newVersion',
          type: 'uint8[]',
        },
      ],
      name: 'changeSTVersionBounds',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getLowerSTVersionBounds',
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
      constant: true,
      inputs: [],
      name: 'getUpperSTVersionBounds',
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
      constant: true,
      inputs: [],
      name: 'getSetupCost',
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
      name: 'getName',
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
  ],
};
