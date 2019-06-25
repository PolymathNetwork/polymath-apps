// eslint:disable
export const USDTieredSTOAbi = {
  contractName: 'USDTieredSTO',
  abi: [
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      name: 'tiers',
      outputs: [
        {
          name: 'rate',
          type: 'uint256',
        },
        {
          name: 'rateDiscountPoly',
          type: 'uint256',
        },
        {
          name: 'tokenTotal',
          type: 'uint256',
        },
        {
          name: 'tokensDiscountPoly',
          type: 'uint256',
        },
        {
          name: 'mintedTotal',
          type: 'uint256',
        },
        {
          name: 'mintedDiscountPoly',
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
          name: '',
          type: 'uint256',
        },
      ],
      name: 'investorsList',
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
      name: 'allowBeneficialInvestments',
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
      name: 'endTime',
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
      inputs: [],
      name: 'unpause',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'nonAccreditedLimitUSD',
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
      name: 'totalTokensSold',
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
      name: 'finalAmountReturned',
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
          name: '',
          type: 'address',
        },
      ],
      name: 'investors',
      outputs: [
        {
          name: 'accredited',
          type: 'uint8',
        },
        {
          name: 'seen',
          type: 'uint8',
        },
        {
          name: 'nonAccreditedLimitUSDOverride',
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
      name: 'stableCoinsRaised',
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
      name: 'startTime',
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
      inputs: [],
      name: 'pause',
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
          type: 'address',
        },
        {
          name: '',
          type: 'uint8',
        },
      ],
      name: 'investorInvested',
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
      inputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      name: 'usdTokenEnabled',
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
      name: 'isFinalized',
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
      name: 'ETH_ORACLE',
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
          name: '_fundRaiseType',
          type: 'uint8',
        },
      ],
      name: 'getRaised',
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
      name: 'POLY_ORACLE',
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
      name: 'pausedTime',
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
      name: 'usdTokens',
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
      inputs: [
        {
          name: '',
          type: 'uint8',
        },
      ],
      name: 'fundsRaised',
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
          name: '',
          type: 'address',
        },
      ],
      name: 'investorInvestedUSD',
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
          name: '',
          type: 'uint8',
        },
      ],
      name: 'fundRaiseTypes',
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
      name: 'currentTier',
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
      name: 'reserveWallet',
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
      name: 'investorCount',
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
      name: 'minimumInvestmentUSD',
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
      name: 'fundsRaisedUSD',
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
      payable: true,
      stateMutability: 'payable',
      type: 'fallback',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_allowed',
          type: 'bool',
        },
      ],
      name: 'SetAllowBeneficialInvestments',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_investor',
          type: 'address',
        },
        {
          indexed: false,
          name: '_limit',
          type: 'uint256',
        },
      ],
      name: 'SetNonAccreditedLimit',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_investor',
          type: 'address',
        },
        {
          indexed: false,
          name: '_accredited',
          type: 'bool',
        },
      ],
      name: 'SetAccredited',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_purchaser',
          type: 'address',
        },
        {
          indexed: true,
          name: '_beneficiary',
          type: 'address',
        },
        {
          indexed: false,
          name: '_tokens',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_usdAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_tierPrice',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_tier',
          type: 'uint256',
        },
      ],
      name: 'TokenPurchase',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_purchaser',
          type: 'address',
        },
        {
          indexed: true,
          name: '_beneficiary',
          type: 'address',
        },
        {
          indexed: false,
          name: '_usdAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_fundRaiseType',
          type: 'uint8',
        },
        {
          indexed: false,
          name: '_receivedValue',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_spentValue',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_rate',
          type: 'uint256',
        },
      ],
      name: 'FundsReceived',
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
          indexed: true,
          name: '_wallet',
          type: 'address',
        },
        {
          indexed: false,
          name: '_tokens',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_latestTier',
          type: 'uint256',
        },
      ],
      name: 'ReserveTokenMint',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_wallet',
          type: 'address',
        },
        {
          indexed: true,
          name: '_reserveWallet',
          type: 'address',
        },
        {
          indexed: false,
          name: '_usdTokens',
          type: 'address[]',
        },
      ],
      name: 'SetAddresses',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_nonAccreditedLimitUSD',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_minimumInvestmentUSD',
          type: 'uint256',
        },
      ],
      name: 'SetLimits',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_startTime',
          type: 'uint256',
        },
        {
          indexed: false,
          name: '_endTime',
          type: 'uint256',
        },
      ],
      name: 'SetTimes',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_ratePerTier',
          type: 'uint256[]',
        },
        {
          indexed: false,
          name: '_ratePerTierDiscountPoly',
          type: 'uint256[]',
        },
        {
          indexed: false,
          name: '_tokensPerTierTotal',
          type: 'uint256[]',
        },
        {
          indexed: false,
          name: '_tokensPerTierDiscountPoly',
          type: 'uint256[]',
        },
      ],
      name: 'SetTiers',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_fundRaiseTypes',
          type: 'uint8[]',
        },
      ],
      name: 'SetFundRaiseTypes',
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
      constant: false,
      inputs: [
        {
          name: '_startTime',
          type: 'uint256',
        },
        {
          name: '_endTime',
          type: 'uint256',
        },
        {
          name: '_ratePerTier',
          type: 'uint256[]',
        },
        {
          name: '_ratePerTierDiscountPoly',
          type: 'uint256[]',
        },
        {
          name: '_tokensPerTierTotal',
          type: 'uint256[]',
        },
        {
          name: '_tokensPerTierDiscountPoly',
          type: 'uint256[]',
        },
        {
          name: '_nonAccreditedLimitUSD',
          type: 'uint256',
        },
        {
          name: '_minimumInvestmentUSD',
          type: 'uint256',
        },
        {
          name: '_fundRaiseTypes',
          type: 'uint8[]',
        },
        {
          name: '_wallet',
          type: 'address',
        },
        {
          name: '_reserveWallet',
          type: 'address',
        },
        {
          name: '_usdTokens',
          type: 'address[]',
        },
      ],
      name: 'configure',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_fundRaiseTypes',
          type: 'uint8[]',
        },
      ],
      name: 'modifyFunding',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_nonAccreditedLimitUSD',
          type: 'uint256',
        },
        {
          name: '_minimumInvestmentUSD',
          type: 'uint256',
        },
      ],
      name: 'modifyLimits',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_ratePerTier',
          type: 'uint256[]',
        },
        {
          name: '_ratePerTierDiscountPoly',
          type: 'uint256[]',
        },
        {
          name: '_tokensPerTierTotal',
          type: 'uint256[]',
        },
        {
          name: '_tokensPerTierDiscountPoly',
          type: 'uint256[]',
        },
      ],
      name: 'modifyTiers',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_startTime',
          type: 'uint256',
        },
        {
          name: '_endTime',
          type: 'uint256',
        },
      ],
      name: 'modifyTimes',
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
        {
          name: '_reserveWallet',
          type: 'address',
        },
        {
          name: '_usdTokens',
          type: 'address[]',
        },
      ],
      name: 'modifyAddresses',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'finalize',
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
          name: '_accredited',
          type: 'bool[]',
        },
      ],
      name: 'changeAccredited',
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
          name: '_nonAccreditedLimit',
          type: 'uint256[]',
        },
      ],
      name: 'changeNonAccreditedLimit',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getAccreditedData',
      outputs: [
        {
          name: '',
          type: 'address[]',
        },
        {
          name: '',
          type: 'bool[]',
        },
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
          name: '_allowBeneficialInvestments',
          type: 'bool',
        },
      ],
      name: 'changeAllowBeneficialInvestments',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_beneficiary',
          type: 'address',
        },
      ],
      name: 'buyWithETH',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_beneficiary',
          type: 'address',
        },
        {
          name: '_investedPOLY',
          type: 'uint256',
        },
      ],
      name: 'buyWithPOLY',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_beneficiary',
          type: 'address',
        },
        {
          name: '_investedSC',
          type: 'uint256',
        },
        {
          name: '_usdToken',
          type: 'address',
        },
      ],
      name: 'buyWithUSD',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_beneficiary',
          type: 'address',
        },
        {
          name: '_minTokens',
          type: 'uint256',
        },
      ],
      name: 'buyWithETHRateLimited',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_beneficiary',
          type: 'address',
        },
        {
          name: '_investedPOLY',
          type: 'uint256',
        },
        {
          name: '_minTokens',
          type: 'uint256',
        },
      ],
      name: 'buyWithPOLYRateLimited',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_beneficiary',
          type: 'address',
        },
        {
          name: '_investedSC',
          type: 'uint256',
        },
        {
          name: '_minTokens',
          type: 'uint256',
        },
        {
          name: '_usdToken',
          type: 'address',
        },
      ],
      name: 'buyWithUSDRateLimited',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_beneficiary',
          type: 'address',
        },
        {
          name: '_investmentValue',
          type: 'uint256',
        },
        {
          name: '_fundRaiseType',
          type: 'uint8',
        },
      ],
      name: 'buyTokensView',
      outputs: [
        {
          name: 'spentUSD',
          type: 'uint256',
        },
        {
          name: 'spentValue',
          type: 'uint256',
        },
        {
          name: 'tokensMinted',
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
      name: 'isOpen',
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
      name: 'capReached',
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
          name: '_fundRaiseType',
          type: 'uint8',
        },
      ],
      name: 'getRate',
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
          name: '_fundRaiseType',
          type: 'uint8',
        },
        {
          name: '_amount',
          type: 'uint256',
        },
      ],
      name: 'convertToUSD',
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
          name: '_fundRaiseType',
          type: 'uint8',
        },
        {
          name: '_amount',
          type: 'uint256',
        },
      ],
      name: 'convertFromUSD',
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
      name: 'getTokensSold',
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
      name: 'getTokensMinted',
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
          name: '_fundRaiseType',
          type: 'uint8',
        },
      ],
      name: 'getTokensSoldFor',
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
          name: '_tier',
          type: 'uint256',
        },
      ],
      name: 'getTokensMintedByTier',
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
      constant: true,
      inputs: [
        {
          name: '_tier',
          type: 'uint256',
        },
      ],
      name: 'getTokensSoldByTier',
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
      name: 'getNumberOfTiers',
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
      name: 'getUsdTokens',
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
    {
      constant: true,
      inputs: [],
      name: 'getSTODetails',
      outputs: [
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
          type: 'uint256',
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
          type: 'uint256',
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
  ],
};
