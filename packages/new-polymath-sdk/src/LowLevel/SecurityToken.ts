import Web3 from 'web3';
import { web3 } from './web3Client';
import { TransactionObject } from 'web3/eth/types';
import BigNumber from 'bignumber.js';
import {
  DividendModuleTypes,
  GenericContract,
  Checkpoint,
  InvestorBalance,
  ModuleTypes,
  AddDividendsModuleArgs,
  GetModuleAddressArgs,
} from './types';
import { Context } from './LowLevel';
import { fromUnixTimestamp, fromWei } from './utils';
import { Erc20DividendCheckpoint } from './Erc20DividendCheckpoint';
import { EtherDividendCheckpoint } from './EtherDividendCheckpoint';
import { SecurityTokenAbi } from './abis/SecurityTokenAbi';
import { DividendCheckpointAbi } from './abis/DividendCheckpointAbi';
import { Contract } from './Contract';

// This type should be obtained from a library (must match ABI)
interface SecurityTokenContract extends GenericContract {
  methods: {
    createCheckpoint(): TransactionObject<number>;
    getCheckpointTimes(): TransactionObject<number[]>;
    totalSupplyAt(checkpointId: number): TransactionObject<number>;
    balanceOfAt(
      investorAddress: string,
      checkpointId: number
    ): TransactionObject<number>;
    getInvestorsAt(checkpointId: number): TransactionObject<string[]>;
    currentCheckpointId(): TransactionObject<number>;
    addModule(
      address: string,
      data: string,
      maxCost: BigNumber,
      budget: BigNumber
    ): TransactionObject<void>;
    getModulesByName(name: string): TransactionObject<string[]>;
    name(): TransactionObject<string>;
  };
}

export class SecurityToken extends Contract<SecurityTokenContract> {
  constructor({ address, context }: { address: string; context: Context }) {
    super({ address, abi: SecurityTokenAbi.abi, context });
  }

  public createCheckpoint = async () => {
    return () =>
      this.contract.methods
        .createCheckpoint()
        .send({ from: this.context.account });
  };

  public async currentCheckpointId() {
    return this.contract.methods.currentCheckpointId().call();
  }

  public addDividendsModule = async ({
    type,
    wallet,
  }: AddDividendsModuleArgs) => {
    const factoryMappings = {
      [DividendModuleTypes.Erc20]: 'ERC20DividendCheckpoint',
      [DividendModuleTypes.Eth]: 'EtherDividendCheckpoint',
    };

    const factoryAddress = await this.context.moduleRegistry.getModuleFactoryAddress(
      {
        moduleName: factoryMappings[type],
        moduleType: ModuleTypes.Dividends,
        tokenAddress: this.address,
      }
    );

    const configFunctionAbi = DividendCheckpointAbi.abi.find(
      prop => prop.name === 'configure' && prop.type === 'function'
    );

    if (!configFunctionAbi) {
      throw new Error(
        'Corrupt DividendCheckpoint ABI. No "configure" function found.'
      );
    }

    const configData = web3.eth.abi.encodeFunctionCall(configFunctionAbi, [
      wallet,
    ]);

    return () =>
      this.contract.methods
        .addModule(
          factoryAddress,
          configData,
          new BigNumber(0),
          new BigNumber(0)
        )
        .send({ from: this.context.account });
  };

  public async getErc20DividendModule() {
    const address = await this.getModuleAddress({
      name: 'ERC20DividendCheckpoint',
    });

    if (!address) {
      return null;
    }

    return new Erc20DividendCheckpoint({ address, context: this.context });
  }

  public async getEtherDividendModule() {
    const address = await this.getModuleAddress({
      name: 'EtherDividendCheckpoint',
    });

    if (!address) {
      return null;
    }

    return new EtherDividendCheckpoint({ address, context: this.context });
  }

  public async getCheckpoints() {
    const { methods } = this.contract;

    const checkpointTimes = await methods.getCheckpointTimes().call();

    const checkpoints: Checkpoint[] = [];

    for (let i = 0; i < checkpointTimes.length; i += 1) {
      const checkpointId = i + 1;
      const timestamp = checkpointTimes[i];
      const totalSupplyInWei = await methods.totalSupplyAt(checkpointId).call();
      const investorAddresses = await methods
        .getInvestorsAt(checkpointId)
        .call();

      const investorBalances: InvestorBalance[] = [];

      for (const investorAddress of investorAddresses) {
        const balanceInWei = await methods
          .balanceOfAt(investorAddress, checkpointId)
          .call();

        investorBalances.push({
          balance: fromWei(balanceInWei),
          address: investorAddress,
        });
      }

      checkpoints.push({
        index: checkpointId,
        totalSupply: fromWei(totalSupplyInWei),
        investorBalances,
        createdAt: fromUnixTimestamp(timestamp),
      });
    }

    return checkpoints;
  }

  public async name() {
    return this.contract.methods.name().call();
  }

  private async getModuleAddress({ name }: GetModuleAddressArgs) {
    const hexName = Web3.utils.asciiToHex(name);
    const moduleAddresses = await this.contract.methods
      .getModulesByName(hexName)
      .call();

    return moduleAddresses[0] || null;
  }
}
