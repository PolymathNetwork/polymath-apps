// eslint:disable
export const ERC20DividendCheckpointAbi = [
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
    signature: '0x0945812e',
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
    signature: '0x0a29f591',
  },
  {
    constant: false,
    inputs: [],
    name: 'reclaimETH',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x0f144a48',
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
    signature: '0x1613ec9d',
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
    signature: '0x28d1feda',
  },
  {
    constant: true,
    inputs: [],
    name: 'ADMIN',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
    signature: '0x2a0acc6a',
  },
  {
    constant: true,
    inputs: [],
    name: 'getTreasuryWallet',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
    signature: '0x2c035b74',
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
    signature: '0x30008b48',
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
    signature: '0x3f2e3165',
  },
  {
    constant: false,
    inputs: [],
    name: 'unpause',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x3f4ba83a',
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
    signature: '0x4d58e413',
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
    signature: '0x521eb273',
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
    signature: '0x562beba8',
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
    signature: '0x5bea0e1c',
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
    signature: '0x5c975abb',
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
    signature: '0x5daff64e',
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
    signature: '0x6faa22a5',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_dividendIndex',
        type: 'uint256',
      },
      {
        name: '_maturity',
        type: 'uint256',
      },
      {
        name: '_expiry',
        type: 'uint256',
      },
    ],
    name: 'updateDividendDates',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x73e9e1a3',
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
    signature: '0x75cb2672',
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
    signature: '0x7a3e23fd',
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
    signature: '0x7b4a223b',
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
    signature: '0x814b3fe0',
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
    signature: '0x81e97b66',
  },
  {
    constant: false,
    inputs: [],
    name: 'pause',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x8456cb59',
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
    signature: '0x8596e6e6',
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
    signature: '0x8905fd4f',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    name: 'dividendTokens',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
    signature: '0x95ec5bbe',
  },
  {
    constant: true,
    inputs: [],
    name: 'OPERATOR',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
    signature: '0x983d2737',
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
    signature: '0x98b9a2dc',
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
    signature: '0xac121dbf',
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
    signature: '0xb84dfbd2',
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
    signature: '0xbee2ddc2',
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
    signature: '0xc3a07df6',
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
    signature: '0xc45a0155',
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
    signature: '0xcc1556dc',
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
        name: '_end',
        type: 'uint256',
      },
    ],
    name: 'pushDividendPayment',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0xe1726faa',
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
    signature: '0xf1e9d100',
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
    signature: '0xfa67a7bb',
  },
  {
    constant: true,
    inputs: [],
    name: 'getDataStore',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
    signature: '0xfe58265e',
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
    signature: '0xff0b9c90',
  },
  {
    inputs: [
      {
        name: '_securityToken',
        type: 'address',
      },
      {
        name: '_polyToken',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
    signature: 'constructor',
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
        name: '_maturity',
        type: 'uint256',
      },
      {
        indexed: false,
        name: '_expiry',
        type: 'uint256',
      },
      {
        indexed: true,
        name: '_token',
        type: 'address',
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
    name: 'ERC20DividendDeposited',
    type: 'event',
    signature:
      '0xc9f26fbad84e7b32db278009385cb48ff8201ed9e7cdefe89db89592953b1e9e',
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
        indexed: true,
        name: '_dividendIndex',
        type: 'uint256',
      },
      {
        indexed: true,
        name: '_token',
        type: 'address',
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
    name: 'ERC20DividendClaimed',
    type: 'event',
    signature:
      '0xced5aaa2960f7fd397627b6d68ccb25eae2d3db92a459182962e6f9b5786241a',
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
        indexed: true,
        name: '_dividendIndex',
        type: 'uint256',
      },
      {
        indexed: true,
        name: '_token',
        type: 'address',
      },
      {
        indexed: false,
        name: '_claimedAmount',
        type: 'uint256',
      },
    ],
    name: 'ERC20DividendReclaimed',
    type: 'event',
    signature:
      '0x9766d0325a2a3c017f6cf974bfd1bd0b26e705570ce8250fe5e078a3e832d52d',
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
        indexed: true,
        name: '_dividendIndex',
        type: 'uint256',
      },
      {
        indexed: true,
        name: '_token',
        type: 'address',
      },
      {
        indexed: false,
        name: '_withheldAmount',
        type: 'uint256',
      },
    ],
    name: 'ERC20DividendWithholdingWithdrawn',
    type: 'event',
    signature:
      '0x31342482aee689b025c9cbe348134fefee05df6d6ac65a91dd6b0abdf454539f',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: '_excluded',
        type: 'address[]',
      },
    ],
    name: 'SetDefaultExcludedAddresses',
    type: 'event',
    signature:
      '0xcbdf8a4bf19b153fdd0aa4aa2c292cef47adc56e05524f1d99658f03b771e237',
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
    ],
    name: 'SetWithholding',
    type: 'event',
    signature:
      '0x01da14148cd0c4104d62830cfe6127c6955f1074631149adde6809b8687988d9',
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
    ],
    name: 'SetWithholdingFixed',
    type: 'event',
    signature:
      '0x02d4071fbc08756ffe4bca9edb3e963c0b64703f966b7aafc724acce3e09c32b',
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
    ],
    name: 'SetWallet',
    type: 'event',
    signature:
      '0x8595877311e370fe3ac87d4f6d12473603393f02ac660e68d2e5e3da5adb610c',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_dividendIndex',
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
    ],
    name: 'UpdateDividendDates',
    type: 'event',
    signature:
      '0x4d385ba2c40259cda374f5596718ac5694e5849b23572b3f59b4fd1be037a860',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Pause',
    type: 'event',
    signature:
      '0x5ee71a369c8672edded508e624ffc9257fa1ae6886ef32905c18e60196bca399',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpause',
    type: 'event',
    signature:
      '0xaeb196d352664784d1900b0e7414a8face7d29f4dae8c4b0cf68ed477423bbf4',
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
        name: '_token',
        type: 'address',
      },
      {
        name: '_amount',
        type: 'uint256',
      },
      {
        name: '_name',
        type: 'bytes32',
      },
    ],
    name: 'createDividend',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0xb7e1fd9b',
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
        name: '_token',
        type: 'address',
      },
      {
        name: '_amount',
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
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x6e742c77',
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
        name: '_token',
        type: 'address',
      },
      {
        name: '_amount',
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
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x22018ce7',
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
        name: '_token',
        type: 'address',
      },
      {
        name: '_amount',
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
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x43647a62',
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
    signature: '0xaa8b76ea',
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
    signature: '0x333cffe5',
  },
];
