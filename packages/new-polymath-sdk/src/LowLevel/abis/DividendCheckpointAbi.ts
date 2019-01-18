// tslint:disable
export const DividendCheckpointAbi = {
  contractName: 'DividendCheckpoint',
  abi: [
    {
      constant: true,
      inputs: [],
      name: 'EXCLUDED_ADDRESS_LIMIT',
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
      name: 'CHECKPOINT',
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
      name: 'wallet',
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
      name: 'MANAGE',
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
      inputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      name: 'withholdingTax',
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
      name: 'DISTRIBUTE',
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
      name: 'dividends',
      outputs: [
        {
          name: 'checkpointId',
          type: 'uint256',
        },
        {
          name: 'created',
          type: 'uint256',
        },
        {
          name: 'maturity',
          type: 'uint256',
        },
        {
          name: 'expiry',
          type: 'uint256',
        },
        {
          name: 'amount',
          type: 'uint256',
        },
        {
          name: 'claimedAmount',
          type: 'uint256',
        },
        {
          name: 'totalSupply',
          type: 'uint256',
        },
        {
          name: 'reclaimed',
          type: 'bool',
        },
        {
          name: 'totalWithheld',
          type: 'uint256',
        },
        {
          name: 'totalWithheldWithdrawn',
          type: 'uint256',
        },
        {
          name: 'name',
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
      inputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      name: 'excluded',
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
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_excluded',
          type: 'address[]',
        },
        {
          indexed: false,
          name: '_timestamp',
          type: 'uint256',
        },
      ],
      name: 'SetDefaultExcludedAddresses',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_investors',
          type: 'address[]',
        },
        {
          indexed: false,
          name: '_withholding',
          type: 'uint256[]',
        },
        {
          indexed: false,
          name: '_timestamp',
          type: 'uint256',
        },
      ],
      name: 'SetWithholding',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_investors',
          type: 'address[]',
        },
        {
          indexed: false,
          name: '_withholding',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_timestamp',
          type: 'uint256',
        },
      ],
      name: 'SetWithholdingFixed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_oldWallet',
          type: 'address',
        },
        {
          indexed: true,
          name: '_newWallet',
          type: 'address',
        },
        {
          indexed: false,
          name: '_timestamp',
          type: 'uint256',
        },
      ],
      name: 'SetWallet',
      type: 'event',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_wallet',
          type: 'address',
        },
      ],
      name: 'configure',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
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
          name: '_wallet',
          type: 'address',
        },
      ],
      name: 'changeWallet',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getDefaultExcluded',
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
          name: '_excluded',
          type: 'address[]',
        },
      ],
      name: 'setDefaultExcluded',
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
          name: '_withholding',
          type: 'uint256[]',
        },
      ],
      name: 'setWithholding',
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
          name: '_withholding',
          type: 'uint256',
        },
      ],
      name: 'setWithholdingFixed',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_dividendIndex',
          type: 'uint256',
        },
        {
          name: '_payees',
          type: 'address[]',
        },
      ],
      name: 'pushDividendPaymentToAddresses',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_dividendIndex',
          type: 'uint256',
        },
        {
          name: '_start',
          type: 'uint256',
        },
        {
          name: '_iterations',
          type: 'uint256',
        },
      ],
      name: 'pushDividendPayment',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_dividendIndex',
          type: 'uint256',
        },
      ],
      name: 'pullDividendPayment',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_dividendIndex',
          type: 'uint256',
        },
      ],
      name: 'reclaimDividend',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_dividendIndex',
          type: 'uint256',
        },
        {
          name: '_payee',
          type: 'address',
        },
      ],
      name: 'calculateDividend',
      outputs: [
        {
          name: '',
          type: 'uint256',
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
      constant: true,
      inputs: [
        {
          name: '_checkpointId',
          type: 'uint256',
        },
      ],
      name: 'getDividendIndex',
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
      constant: false,
      inputs: [
        {
          name: '_dividendIndex',
          type: 'uint256',
        },
      ],
      name: 'withdrawWithholding',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getDividendsData',
      outputs: [
        {
          name: 'createds',
          type: 'uint256[]',
        },
        {
          name: 'maturitys',
          type: 'uint256[]',
        },
        {
          name: 'expirys',
          type: 'uint256[]',
        },
        {
          name: 'amounts',
          type: 'uint256[]',
        },
        {
          name: 'claimedAmounts',
          type: 'uint256[]',
        },
        {
          name: 'names',
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
          name: '_dividendIndex',
          type: 'uint256',
        },
      ],
      name: 'getDividendData',
      outputs: [
        {
          name: 'created',
          type: 'uint256',
        },
        {
          name: 'maturity',
          type: 'uint256',
        },
        {
          name: 'expiry',
          type: 'uint256',
        },
        {
          name: 'amount',
          type: 'uint256',
        },
        {
          name: 'claimedAmount',
          type: 'uint256',
        },
        {
          name: 'name',
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
          name: '_dividendIndex',
          type: 'uint256',
        },
      ],
      name: 'getDividendProgress',
      outputs: [
        {
          name: 'investors',
          type: 'address[]',
        },
        {
          name: 'resultClaimed',
          type: 'bool[]',
        },
        {
          name: 'resultExcluded',
          type: 'bool[]',
        },
        {
          name: 'resultWithheld',
          type: 'uint256[]',
        },
        {
          name: 'resultAmount',
          type: 'uint256[]',
        },
        {
          name: 'resultBalance',
          type: 'uint256[]',
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
          name: '_checkpointId',
          type: 'uint256',
        },
      ],
      name: 'getCheckpointData',
      outputs: [
        {
          name: 'investors',
          type: 'address[]',
        },
        {
          name: 'balances',
          type: 'uint256[]',
        },
        {
          name: 'withholdings',
          type: 'uint256[]',
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
          name: '_investor',
          type: 'address',
        },
        {
          name: '_dividendIndex',
          type: 'uint256',
        },
      ],
      name: 'isExcluded',
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
          name: '_investor',
          type: 'address',
        },
        {
          name: '_dividendIndex',
          type: 'uint256',
        },
      ],
      name: 'isClaimed',
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
