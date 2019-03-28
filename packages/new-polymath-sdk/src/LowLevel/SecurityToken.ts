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
  GetCheckpointArgs,
} from './types';
import { Context } from './LowLevel';
import { fromUnixTimestamp, fromWei } from './utils';
import { Erc20DividendCheckpoint } from './Erc20DividendCheckpoint';
import { EtherDividendCheckpoint } from './EtherDividendCheckpoint';
import { SecurityTokenAbi } from './abis/SecurityTokenAbi';
import { DividendCheckpointAbi } from './abis/DividendCheckpointAbi';
import { Contract } from './Contract';

interface ModuleData {
  /**
   * name in hex
   */
  0: string;
  /**
   * address
   */
  1: string;
  /**
   * factory address
   */
  2: string;
  /**
   * archived status
   */
  3: boolean;
  /**
   * module type
   */
  4: ModuleTypes;
}

// This type should be obtained from a library (must match ABI)
interface SecurityTokenContract extends GenericContract {
  methods: {
    createCheckpoint(): TransactionObject<void>;
    getCheckpointTimes(): TransactionObject<string[]>;
    totalSupplyAt(checkpointId: number): TransactionObject<string>;
    balanceOfAt(
      investorAddress: string,
      checkpointId: number
    ): TransactionObject<string>;
    getInvestorsAt(checkpointId: number): TransactionObject<string[]>;
    currentCheckpointId(): TransactionObject<string>;
    addModule(
      address: string,
      data: string,
      maxCost: BigNumber,
      budget: BigNumber
    ): TransactionObject<void>;
    getModulesByName(name: string): TransactionObject<string[]>;
    name(): TransactionObject<string>;
    getModule(address: string): TransactionObject<ModuleData>;
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
    const currentCheckpointId = await this.contract.methods
      .currentCheckpointId()
      .call();

    return parseInt(currentCheckpointId, 10);
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

  public getErc20DividendModule = async () => {
    const address = await this.getFirstUnarchivedModuleAddress({
      name: 'ERC20DividendCheckpoint',
    });

    if (!address) {
      return null;
    }

    return new Erc20DividendCheckpoint({ address, context: this.context });
  };

  public async getEtherDividendModule() {
    const address = await this.getFirstUnarchivedModuleAddress({
      name: 'EtherDividendCheckpoint',
    });

    if (!address) {
      return null;
    }

    return new EtherDividendCheckpoint({ address, context: this.context });
  }

  public getCheckpoint = async ({ checkpointId }: GetCheckpointArgs) => {
    const { methods } = this.contract;

    const checkpointTimes = await methods.getCheckpointTimes().call();

    return this.getCheckpointData({
      checkpointId,
      timestamp: parseInt(checkpointTimes[checkpointId - 1], 10),
    });
  };

  public async getCheckpoints() {
    const { methods } = this.contract;

    const checkpointTimes = await methods.getCheckpointTimes().call();

    const checkpoints: Checkpoint[] = await Promise.all(
      checkpointTimes.map((timestamp, index) =>
        this.getCheckpointData({
          checkpointId: index + 1,
          timestamp: parseInt(timestamp, 10),
        })
      )
    );

    return checkpoints.sort((a, b) => {
      return a.index - b.index;
    });
  }

  public async name() {
    return this.contract.methods.name().call();
  }

  private async getFirstUnarchivedModuleAddress({ name }: GetModuleAddressArgs) {
    const hexName = Web3.utils.asciiToHex(name);
    const { methods } = this.contract;
    const moduleAddresses = await methods
      .getModulesByName(hexName)
      .call();

    
    for (const address of moduleAddresses) {
      const { 3: isArchived } = await methods.getModule(address).call();

      if (!isArchived) {
        return address;
      }
    }

    return null;
  }

  private getCheckpointData = async ({
    checkpointId,
    timestamp,
  }: {
    checkpointId: number;
    timestamp: number;
  }): Promise<Checkpoint> => {
    const { methods } = this.contract;
    const totalSupplyInWei = await methods.totalSupplyAt(checkpointId).call();
    const investorAddresses = await methods.getInvestorsAt(checkpointId).call();

    const investorBalances: InvestorBalance[] = await Promise.all(
      investorAddresses.map(investorAddress =>
        this.getInvestorBalance({ investorAddress, checkpointId })
      )
    );

    return {
      index: checkpointId,
      totalSupply: fromWei(totalSupplyInWei),
      investorBalances,
      createdAt: fromUnixTimestamp(timestamp),
    };
  };

  private getInvestorBalance = async ({
    investorAddress,
    checkpointId,
  }: {
    investorAddress: string;
    checkpointId: number;
  }): Promise<InvestorBalance> => {
    const balanceInWei = await this.contract.methods
      .balanceOfAt(investorAddress, checkpointId)
      .call();

    return {
      balance: fromWei(balanceInWei),
      address: investorAddress,
    };
  };


}
