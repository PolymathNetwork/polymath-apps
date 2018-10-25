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
import web3 from 'web3';
import BigNumber from 'bignumber.js';
import IModuleFactoryArtifacts from '@polymathnetwork/shared/fixtures/contracts/IModuleFactory.json';
import ISTOArtifacts from '@polymathnetwork/shared/fixtures/contracts/ISTO.json';

import { ModuleFactoryAbisByType, MODULE_TYPES } from '../constants';
import USDTieredSTO from './USDTieredSTO';

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
  const type: STOModuleType = web3.utils.hexToUtf8(nameRes);

  let sto;
  if (type === 'USDTieredSTO') {
    sto = new USDTieredSTO(stoAddress, securityToken);
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
  const type = web3.utils.hexToUtf8(nameRes);

  const ModuleFactory = await getSTOModuleFactoryContract(type, address);

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

  return stoModules;
}

export async function setupSTOModule(
  stoModule: STOModule,
  tokenAddress: string,
  configValues: STOConfig
) {
  const { address, setupCost } = stoModule;

  // const ModuleFactory = await getSTOModuleFactoryContract(type, address);

  // TODO @RafaelVidaurre: tokenAddress.balance should be used to verify
  await PolyToken.transfer(tokenAddress, setupCost);

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

  const securityToken = new SecurityToken(tokenAddress);

  const test = await securityToken._tx(
    securityToken._methods.addModule(
      address,
      encodedFunctionCall,
      toWei(setupCost),
      0 //What is this for?
    )
  );
}
