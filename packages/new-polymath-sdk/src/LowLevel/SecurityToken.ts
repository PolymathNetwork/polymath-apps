import Web3 from 'web3';
import { TransactionObject } from 'web3/eth/types';
import BigNumber from 'bignumber.js';
import { ModuleTypes } from '~/types';
import { DividendModuleTypes, GenericContract } from './types';
import { Context } from './LowLevel';
import { fromUnixTimestamp, fromWei } from './utils';
import { Erc20DividendCheckpoint } from './Erc20DividendCheckpoint';
import { EtherDividendCheckpoint } from './EtherDividendCheckpoint';
import { SecurityTokenAbi } from './abis/SecurityTokenAbi';
import { Contract } from './Contract';

export interface InvestorBalance {
  address: string;
  balance: BigNumber;
}

export interface Checkpoint {
  id: number;
  investorBalances: InvestorBalance[];
  totalSupply: BigNumber;
  createdAt: Date;
}

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
  };
}

export class SecurityToken extends Contract<SecurityTokenContract> {
  constructor({ address, context }: { address: string; context: Context }) {
    super({ address, abi: SecurityTokenAbi.abi, context });
  }

  public async createCheckpoint() {
    return this.contract.methods.createCheckpoint().send();
  }

  public async currentCheckpointId() {
    return this.contract.methods.currentCheckpointId().call();
  }

  public async addDividendsModule(type: DividendModuleTypes) {
    const factoryMappings = [];
    factoryMappings[DividendModuleTypes.Erc20] = 'ERC20DividendCheckpoint';
    factoryMappings[DividendModuleTypes.Eth] = 'EtherDividendCheckpoint';

    const factoryAddress = await this.context.moduleRegistry.getModuleFactoryAddress(
      factoryMappings[type],
      ModuleTypes.Dividends,
      this.address
    );

    return this.contract.methods
      .addModule(
        factoryAddress,
        Web3.utils.asciiToHex(''), // Dividends modules require no configuration data so we send '0x00'
        new BigNumber(0),
        new BigNumber(0)
      )
      .send();
  }

  public async getErc20DividendModule() {
    const address = await this.getModuleAddress('ERC20DividendCheckPoint');

    if (!address) {
      return null;
    }

    return new Erc20DividendCheckpoint({ address, context: this.context });
  }

  public async getEtherDividendModule() {
    const address = await this.getModuleAddress('EtherDividendCheckpoint');

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
        id: checkpointId,
        totalSupply: fromWei(totalSupplyInWei),
        investorBalances,
        createdAt: fromUnixTimestamp(timestamp),
      });
    }

    return checkpoints;
  }

  private async getModuleAddress(name: string) {
    const hexName = Web3.utils.asciiToHex(name);
    const moduleAddresses = await this.contract.methods
      .getModulesByName(hexName)
      .call();

    return moduleAddresses[0] || null;
  }
}
