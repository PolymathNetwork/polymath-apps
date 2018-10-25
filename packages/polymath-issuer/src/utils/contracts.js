// @flow

/**
 * Temporary utilities for interacting with smart contracts, this will
 * be replaced by the new version of polymathjs
 */

import Contract, {
  ModuleRegistry,
  SecurityToken,
  PolyToken,
} from '@polymathnetwork/js';
import web3 from 'web3';
import BigNumber from 'bignumber.js';
import IModuleFactoryArtifacts from '@polymathnetwork/shared/fixtures/contracts/IModuleFactory.json';
import { ModuleFactoryAbisByType, MODULE_TYPES } from '../constants';

import type { STOModule, STOModuleType, STOConfig } from '../constants';

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
  fundRaiseTypes: number,
  wallet: Address,
  reserveWallet: Address,
  usdToken: Address,
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
          type: 'address',
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
      params.usdToken,
    ]
  );
}

// NOTE @RafaelVidaurre: Most of this logic can be shared for any type of modules

export async function getSTOModuleContract(
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
  const type = web3.utils.hexToUtf8(nameRes);

  const ModuleFactory = await getSTOModuleContract(type, address);

  const descriptionRes = await ModuleFactory.methods.getDescription().call();
  const titleRes = await ModuleFactory.methods.getTitle().call();
  const ownerRes = await ModuleFactory.methods.owner().call();
  const setupCostRes = await ModuleFactory.methods.setupCost().call();
  const setupCost = PolyToken.removeDecimals(setupCostRes);

  const stoModuleData = {
    title: titleRes,
    description: descriptionRes,
    type,
    address,
    ownerAddress: ownerRes,
    setupCost,
  };

  return stoModuleData;
}

/**
 * Returns a list of STOModules' information that are compatible with a given
 * security token
 *
 * @param securityTokenAddress
 *
 * @return Array of objects containing information about the available
 * STO modules
 */
export async function getSTOModules(securityTokenAddress: string) {
  const addresses: string[] = await ModuleRegistry.getModulesByTypeAndToken(
    MODULE_TYPES.STO,
    securityTokenAddress
  );

  const gettingSTOModulesData = addresses.map(getSTOModule);

  const stoModules: STOModule[] = await Promise.all(gettingSTOModulesData);

  return stoModules;
}

// 1. Format values
// 2.Send transaction
export async function setupSTOModule(
  stoModule: STOModule,
  securityTokenAddress: string,
  configValues: STOConfig
) {
  const { address, setupCost } = stoModule;

  // const ModuleFactory = await getSTOModuleContract(type, address);

  // TODO @RafaelVidaurre: securityTokenAddress.balance should be used to verify
  await PolyToken.transfer(securityTokenAddress, setupCost);

  const encodedFunctionCall = encodeUSDTieredSTOSetupCall({
    startTime: toUnixTimestamp(configValues.startsAt),
    endTime: toUnixTimestamp(configValues.endsAt),
    ratePerTier: configValues.ratePerTier,
    ratePerTierDiscountPoly: configValues.discountRatePerTier,
    tokensPerTier: configValues.tokensPerTier,
    tokensPerTierDiscountPoly: configValues.discountTokensPerTier,
    nonAccreditedLimitUSD: configValues.nonAccreditedLimit,
    minimumInvestmentUSD: configValues.minimumInvestment,
    fundRaiseTypes: configValues.currencies, // ?
    wallet: configValues.receiverAddress,
    reserveWallet: configValues.unsoldTokensAddress,
    // NOTE @RafaelVidaurre: Disable this until we support DAI
    usdToken: '0x0000000000000000000000000000000000000000',
  });

  const securityToken = new SecurityToken(securityTokenAddress);

  const test = await securityToken._tx(
    securityToken._methods.addModule(
      address,
      encodedFunctionCall,
      toWei(setupCost),
      0 //What is this for?
    )
  );

  console.log('test', test);
}
