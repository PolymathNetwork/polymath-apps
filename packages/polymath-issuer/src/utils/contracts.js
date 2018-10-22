/**
 * Temporary utilities for interacting with smart contracts, this will
 * be replaced by the new version of polymathjs
 */

// @flow
import Contract, { ModuleRegistry } from '@polymathnetwork/js';
import web3 from 'web3';
import IModuleFactoryArtifacts from '@polymathnetwork/shared/fixtures/contracts/IModuleFactory.json';
import { MODULE_TYPES } from '../constants';

import type { STOModuleType } from '../constants';

/**
 * Gets an STO module of a certain type that is compatible with a given
 * security token
 *
 * @param type - STO module type to get
 * @param securityTokenAddress
 */
export async function getSTOModule(
  type: STOModuleType,
  securityTokenAddress: string
) {
  const web3Client = Contract._params.web3;
  const addresses = await ModuleRegistry.getModulesByTypeAndToken(
    MODULE_TYPES.STO,
    securityTokenAddress
  );

  const GenericFactoryModule = new web3Client.eth.Contract(
    IModuleFactoryArtifacts.abi,
    addresses[0]
  );

  const res = web3.toUtf8(await GenericFactoryModule.methods.getName().call());
  // return result;
}
