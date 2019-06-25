import { Context } from '../LowLevel';
import { SecurityToken } from '../SecurityToken';
import { SecurityTokenRegistry } from '../SecurityTokenRegistry';

export class ContractWrapperFactory {
  static concatVersion(versions: number[]) {
    return versions.join('.');
  }

  /**
   * Given contract's address, this function will return a version agnostic contract wrapper.
   */
  static wrapContract = async (contractName: string, address: string, context: Context) => {
    // First, wrap this address with a 'stub' wrapper in order to get deployed contract's version.
    const stubAbi = (await import(`../${contractName}/stub.abi`)).StubAbi;
    const stubClass = (await import(`../${contractName}/stub`)).Stub;
    const stubLowLevelContract = new stubClass({ address, abi: stubAbi, context });

    const versionArray = await stubLowLevelContract.getVersion();
    const version = ContractWrapperFactory.concatVersion(versionArray);

    // Now that we know deployed contract version, we'll wrap it with a version specific contract wrapper.
    const ContractWrapper = (await import(`../${contractName}/${version}`))[contractName];
    const wrappedContract = new ContractWrapper({ address, context });
    return wrappedContract;
  };

  static getSecurityToken = async (address: string, context: Context) => {
    return (await ContractWrapperFactory.wrapContract(
      'SecurityToken',
      address,
      context
    )) as SecurityToken;
  };

  static getSecurityTokenRegistry = async (address: string, context: Context) => {
    return (await ContractWrapperFactory.wrapContract(
      'SecurityTokenRegistry',
      address,
      context
    )) as SecurityTokenRegistry;
  };
}
