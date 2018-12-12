// tslint:disable
export const EtherDividendCheckpointAbi = {
  contractName: 'EtherDividendCheckpoint',
  abi: [
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
      inputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      name: 'investorWithheld',
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
          name: 'dividendWithheld',
          type: 'uint256',
        },
        {
          name: 'dividendWithheldReclaimed',
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
          name: '_depositor',
          type: 'address',
        },
        {
          indexed: false,
          name: '_checkpointId',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_created',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_maturity',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_expiry',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_amount',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_totalSupply',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_dividendIndex',
          type: 'uint256',
        },
        {
          indexed: true,
          name: '_name',
          type: 'bytes32',
        },
      ],
      name: 'EtherDividendDeposited',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_payee',
          type: 'address',
        },
        {
          indexed: false,
          name: '_dividendIndex',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_amount',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_withheld',
          type: 'uint256',
        },
      ],
      name: 'EtherDividendClaimed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_claimer',
          type: 'address',
        },
        {
          indexed: false,
          name: '_dividendIndex',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_claimedAmount',
          type: 'uint256',
        },
      ],
      name: 'EtherDividendReclaimed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_payee',
          type: 'address',
        },
        {
          indexed: false,
          name: '_dividendIndex',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_amount',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_withheld',
          type: 'uint256',
        },
      ],
      name: 'EtherDividendClaimFailed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_claimer',
          type: 'address',
        },
        {
          indexed: false,
          name: '_dividendIndex',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_withheldAmount',
          type: 'uint256',
        },
      ],
      name: 'EtherDividendWithholdingWithdrawn',
      type: 'event',
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
      constant: false,
      inputs: [
        {
          name: '_maturity',
          type: 'uint256',
        },
        {
          name: '_expiry',
          type: 'uint256',
        },
        {
          name: '_name',
          type: 'bytes32',
        },
      ],
      name: 'createDividend',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_maturity',
          type: 'uint256',
        },
        {
          name: '_expiry',
          type: 'uint256',
        },
        {
          name: '_checkpointId',
          type: 'uint256',
        },
        {
          name: '_name',
          type: 'bytes32',
        },
      ],
      name: 'createDividendWithCheckpoint',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_maturity',
          type: 'uint256',
        },
        {
          name: '_expiry',
          type: 'uint256',
        },
        {
          name: '_excluded',
          type: 'address[]',
        },
        {
          name: '_name',
          type: 'bytes32',
        },
      ],
      name: 'createDividendWithExclusions',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_maturity',
          type: 'uint256',
        },
        {
          name: '_expiry',
          type: 'uint256',
        },
        {
          name: '_checkpointId',
          type: 'uint256',
        },
        {
          name: '_excluded',
          type: 'address[]',
        },
        {
          name: '_name',
          type: 'bytes32',
        },
      ],
      name: 'createDividendWithCheckpointAndExclusions',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
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
  ],
};