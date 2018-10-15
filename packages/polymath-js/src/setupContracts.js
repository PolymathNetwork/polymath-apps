// @flow

/**
  NOTE @monitz87: I hacked this library as best I could to support 2.0 in a short time.
  Basically, all "static" contracts (Registries and PolyToken) are exported
  as singletons, but their addressess were being retrieved from the compiled JSON
  instead of PolymathRegistry. To fix that, I had to implement a setup
  function that MUST be called before anything else in the library to make sure
  that the correct addresses are set for all singleton contracts. This is enforced by 
  throwing errors in all getters in classes that extend Contract if the setup function has not been called
 */
import {
  Contract,
  PolyToken,
  SecurityTokenRegistry,
  PolymathRegistry,
  ModuleRegistry,
} from './contracts';

/**
  Gets all static contract addresses from the Polymath Registry and
  sets them accordingly

  @param {string} polymathRegistryAddress address of the deployed polymath registry contract
 */
export const setupContracts = async (polymathRegistryAddress: string) => {
  PolymathRegistry.setAddress(polymathRegistryAddress);

  const getAddress = PolymathRegistry._methods.getAddress;

  const polyTokenAddress = await getAddress('PolyToken').call();
  PolyToken.setAddress(polyTokenAddress);

  const securityTokenRegistryAddress = await getAddress(
    'SecurityTokenRegistry'
  ).call();
  SecurityTokenRegistry.setAddress(securityTokenRegistryAddress);

  const moduleRegistryAddress = await getAddress('ModuleRegistry').call();
  ModuleRegistry.setAddress(moduleRegistryAddress);

  Contract._registryAddressesSet = true;
};
