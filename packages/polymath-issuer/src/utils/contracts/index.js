// @flow

/**
 * !!Temporary!! Utilities for interacting with smart contracts, this will
 * be replaced by the new version of polymathjs
 * NOTE @RafaelVidaurre: Most of this logic can be shared for any type of modules
 */

import Contract, {
  ModuleRegistry,
  SecurityToken,
  PolyToken,
  STO,
} from '@polymathnetwork/js';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import IModuleFactoryArtifacts from '@polymathnetwork/polymath-scripts/fixtures/contracts/IModuleFactory.json';
import ISTOArtifacts from '@polymathnetwork/polymath-scripts/fixtures/contracts/ISTO.json';

import { ModuleFactoryAbisByType, MODULE_TYPES } from '../../constants';
import USDTieredSTO from './USDTieredSTO';

import type { STOModule, STOModuleType } from '../../constants';

type Address = string;
type USDTieredSTOParams = {|
  startTime: number,
  endTime: number,
  ratePerTier: number[],
  ratePerTierDiscountPoly: number[],
  tokensPerTier: number[],
  tokensPerTierDiscountPoly: number[],
  nonAccreditedLimitUSD: number,
  minimumInvestmentUSD: number,
  fundRaiseTypes: number[],
  wallet: Address,
  reserveWallet: Address,
  usdToken: Address,
|};

type CappedSTOParams = {|
  startTime: number,
  endTime: number,
  cap: number,
  rate: number,
  fundRaiseTypes: number[],
  wallet: Address,
|};

// const POLY_TOKEN_DECIMALS = 18;

export function toUnixTimestamp(timestamp: number): number {
  return Math.floor(timestamp / 1000);
}

export function toWei(
  number: BigNumber | number,
  unit: string = 'ether'
): BigNumber {
  return Contract._params.web3.utils.toWei(`${number}`, unit);
}

/**
 * Returns an encoded function call to setup a USDTieredSTO module
 *
 * @param params Function parameters
 */
function encodeUSDTieredSTOSetupCall(params: USDTieredSTOParams) {
  return Contract._params.web3.eth.abi.encodeFunctionCall(
    {
      name: 'configure',
      type: 'function',
      inputs: [
        {
          type: 'uint256',
          name: '_startTime',
        },
        {
          type: 'uint256',
          name: '_endTime',
        },
        {
          type: 'uint256[]',
          name: '_ratePerTier',
        },
        {
          type: 'uint256[]',
          name: '_ratePerTierDiscountPoly',
        },
        {
          type: 'uint256[]',
          name: '_tokensPerTier',
        },
        {
          type: 'uint256[]',
          name: '_tokensPerTierDiscountPoly',
        },
        {
          type: 'uint256',
          name: '_nonAccreditedLimitUSD',
        },
        {
          type: 'uint256',
          name: '_minimumInvestmentUSD',
        },
        {
          type: 'uint8[]',
          name: '_fundRaiseTypes',
        },
        {
          type: 'address',
          name: '_wallet',
        },
        {
          type: 'address',
          name: '_reserveWallet',
        },
        {
          type: 'address[]',
          name: '_usdToken',
        },
      ],
    },
    [
      params.startTime,
      params.endTime,
      params.ratePerTier,
      params.ratePerTierDiscountPoly,
      params.tokensPerTier,
      params.tokensPerTierDiscountPoly,
      params.nonAccreditedLimitUSD,
      params.minimumInvestmentUSD,
      params.fundRaiseTypes,
      params.wallet,
      params.reserveWallet,
      params.usdToken ? [params.usdToken] : [],
    ]
  );
}

/**
 * Returns an encoded function call to setup a CappedSTO module
 *
 * @param params Function parameters
 */
function encodeCappedSTOSetupCall(params: CappedSTOParams) {
  return Contract._params.web3.eth.abi.encodeFunctionCall(
    {
      name: 'configure',
      type: 'function',
      inputs: [
        {
          type: 'uint256',
          name: '_startTime',
        },
        {
          type: 'uint256',
          name: '_endTime',
        },
        {
          type: 'uint256',
          name: '_cap',
        },
        {
          type: 'uint256',
          name: '_rate',
        },
        {
          type: 'uint8[]',
          name: '_fundRaiseTypes',
        },
        {
          type: 'address',
          name: '_fundsReceiver',
        },
      ],
    },
    [
      params.startTime,
      params.endTime,
      params.cap,
      params.rate,
      params.fundRaiseTypes,
      params.wallet,
    ]
  );
}

export async function getTokenSTO(tokenAddress: string) {
  const securityToken = new SecurityToken(tokenAddress);

  const [stoAddress] = await securityToken._methods
    .getModulesByType(MODULE_TYPES.STO)
    .call();

  if (!stoAddress) {
    return null;
  }

  const web3Client = Contract._params.web3;
  const GenericSTO = new web3Client.eth.Contract(ISTOArtifacts.abi, stoAddress);

  const factoryAddress = await GenericSTO.methods.factory().call();
  const GenericModuleFactory = new web3Client.eth.Contract(
    IModuleFactoryArtifacts.abi,
    factoryAddress
  );
  const nameRes = await GenericModuleFactory.methods.getName().call();
  const type: STOModuleType = Web3.utils.hexToUtf8(nameRes);

  let sto;
  if (type === 'USDTieredSTO') {
    sto = new USDTieredSTO(stoAddress);
  }
  if (type === 'CappedSTO') {
    sto = new STO(stoAddress, securityToken);
  }

  return sto;
}

/**
 * Gets a contract instance for a given STOModuleType and address
 *
 * @param type Module's type
 * @param address Module's address
 * @returns Contract instance
 */
export async function getSTOModuleFactoryContract(
  type: STOModuleType,
  address: string
) {
  const web3Client = Contract._params.web3;
  const moduleAbi = ModuleFactoryAbisByType[type];
  if (!moduleAbi) {
    throw new Error(`Abi not found for module factory of type "${type}"`);
  }

  // Generate a Contract instance depending on the ModuleFactory type
  return new web3Client.eth.Contract(moduleAbi, address);
}

/**
 * Retrieves an STOModule's information based on an address
 * @param address
 *
 * @returns An object with information about the STOModule
 */
export async function getSTOModule(address: string) {
  const web3Client = Contract._params.web3;
  const GenericModuleFactory = new web3Client.eth.Contract(
    IModuleFactoryArtifacts.abi,
    address
  );

  // Create a generic contract instance using the IModuleFactory abi
  const nameRes = await GenericModuleFactory.methods.getName().call();
  const type = Web3.utils.hexToUtf8(nameRes);

  const ModuleFactory = await getSTOModuleFactoryContract(type, address);

  const fetchingDescription = ModuleFactory.methods.description().call();
  const fetchingTitle = ModuleFactory.methods.title().call();
  const fetchingOwner = ModuleFactory.methods.owner().call();
  const fetchingSetupCost = ModuleFactory.methods.setupCost().call();
  const fetchingVersion = ModuleFactory.methods.version().call();

  const [
    descriptionRes,
    titleRes,
    ownerRes,
    setupCostRes,
    version,
  ] = await Promise.all([
    fetchingDescription,
    fetchingTitle,
    fetchingOwner,
    fetchingSetupCost,
    fetchingVersion,
  ]);

  const setupCost = PolyToken.removeDecimals(setupCostRes);

  const stoModuleData = {
    title: titleRes,
    description: descriptionRes,
    type,
    address,
    ownerAddress: ownerRes,
    setupCost,
    version,
  };

  return stoModuleData;
}

/**
 * Returns a list of STOModules' information that are compatible with a given
 * security token
 *
 * @param tokenAddress
 *
 * @return Array of objects containing information about the available
 * STO modules
 */
export async function getSTOModules(tokenAddress: string) {
  const addresses: string[] = await ModuleRegistry.getModulesByTypeAndToken(
    MODULE_TYPES.STO,
    tokenAddress
  );

  const gettingSTOModulesData = addresses.map(getSTOModule);

  const stoModules: STOModule[] = await Promise.all(gettingSTOModulesData);

  return stoModules.filter(module => module.version !== '1.0.0');
}

async function paySetupCost(cost: number, tokenAddress: string) {
  const balance = await PolyToken.balanceOf(tokenAddress);

  if (balance.lt(cost)) {
    await PolyToken.transfer(tokenAddress, cost);
  }
}

export async function setupUSDTieredSTOModule(
  stoModule: STOModule,
  tokenAddress: string,
  configValues: any
) {
  const { address, setupCost } = stoModule;

  await paySetupCost(setupCost, tokenAddress);

  const encodeParams = {
    startTime: toUnixTimestamp(configValues.startsAt),
    endTime: toUnixTimestamp(configValues.endsAt),
    ratePerTier: configValues.ratePerTier,
    ratePerTierDiscountPoly: configValues.discountRatePerTier,
    tokensPerTier: configValues.tokensPerTier,
    tokensPerTierDiscountPoly: configValues.discountTokensPerTier,
    nonAccreditedLimitUSD: configValues.nonAccreditedLimit,
    minimumInvestmentUSD: configValues.minimumInvestment,
    fundRaiseTypes: configValues.currencies,
    wallet: configValues.receiverAddress,
    reserveWallet: configValues.unsoldTokensAddress,
    usdToken: configValues.usdTokenAddress,
  };

  const securityToken = new SecurityToken(tokenAddress);
  const encodedFunctionCall = encodeUSDTieredSTOSetupCall(encodeParams);

  await securityToken._tx(
    securityToken._methods.addModule(
      address,
      encodedFunctionCall,
      toWei(setupCost),
      0
    )
  );
}

export async function setupCappedSTOModule(
  stoModule: STOModule,
  tokenAddress: string,
  configValues: any
) {
  const { address, setupCost } = stoModule;

  await paySetupCost(setupCost, tokenAddress);

  const encodeParams = {
    startTime: toUnixTimestamp(configValues.startsAt),
    endTime: toUnixTimestamp(configValues.endsAt),
    cap: configValues.cap,
    rate: configValues.rate,
    fundRaiseTypes: configValues.currencies,
    wallet: configValues.receiverAddress,
  };

  const isLegacySTO = configValues.legacy;

  const securityToken = new SecurityToken(tokenAddress);
  const encodedFunctionCall = encodeCappedSTOSetupCall(encodeParams);

  await securityToken._tx(
    securityToken._methods.addModule(
      isLegacySTO ? '0xA4A24780b93a378eB25eC4bFbf93BC8e79D7EeEb' : address,
      encodedFunctionCall,
      toWei(setupCost),
      0
    )
  );
}
