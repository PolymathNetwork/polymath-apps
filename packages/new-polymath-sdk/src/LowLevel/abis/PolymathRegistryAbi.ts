// tslint:disable
export const PolymathRegistryAbi = {
  contractName: 'PolymathRegistry',
  abi: [
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'bytes32',
        },
      ],
      name: 'storedAddresses',
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
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_nameKey',
          type: 'string',
        },
        {
          indexed: true,
          name: '_oldAddress',
          type: 'address',
        },
        {
          indexed: true,
          name: '_newAddress',
          type: 'address',
        },
      ],
      name: 'ChangeAddress',
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
      constant: true,
      inputs: [
        {
          name: '_nameKey',
          type: 'string',
        },
      ],
      name: 'getAddress',
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
      inputs: [
        {
          name: '_nameKey',
          type: 'string',
        },
        {
          name: '_newAddress',
          type: 'address',
        },
      ],
      name: 'changeAddress',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
};
