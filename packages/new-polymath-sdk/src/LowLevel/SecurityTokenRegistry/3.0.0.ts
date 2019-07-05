import { TransactionObject } from 'web3/eth/types';
import { SecurityTokenRegistryAbi } from './2.0.0.abi';
import { Contract } from '../Contract';
import { Context } from '../LowLevel';
import {
  GenericContract,
  RegisterTickerArgs,
  GenerateNewSecurityTokenArgs,
  GetSecurityTokenArgs,
  GetTickerDetailsArgs,
  IsTickerAvailableArgs,
} from '../types';
import { fromWei, getOptions, version } from '../utils';

import { PolymathError } from '../../PolymathError';
import { ErrorCodes } from '../../types';
import { ZERO_ADDRESS } from '../constants';
import { ContractWrapperFactory } from '../ContractWrapperFactory';

interface SecurityTokenRegistryContract extends GenericContract {
  methods: {
    registerTicker(owner: string, ticker: string, tokenName: string): TransactionObject<void>;
    getTickerDetails(ticker: string): TransactionObject<TickerDetails>;
    getTickerRegistrationFee(): TransactionObject<string>;
    getSecurityTokenLaunchFee(): TransactionObject<string>;
    getSecurityTokenAddress(ticker: string): TransactionObject<string>;
    getLatestProtocolVersion(): TransactionObject<number[]>;
    generateNewSecurityToken(
      name: string,
      ticker: string,
      tokenDetails: string,
      divisible: boolean,
      treasuryWallet: string,
      protocolVersion: number
    ): TransactionObject<void>;
  };
}

export interface TickerDetails {
  /**
   * Owner
   */
  0: string;
  /**
   * Registration Date
   */
  1: string;
  /**
   * Expiry Date
   */
  2: string;
  /**
   * Name
   */
  3: string;
  /**
   * Registration status
   */
  4: boolean;
}

export class SecurityTokenRegistry extends Contract<SecurityTokenRegistryContract> {
  constructor({ address, context }: { address: string; context: Context }) {
    super({ address, abi: SecurityTokenRegistryAbi, context });
  }

  public registerTicker = async ({ owner, ticker, tokenName }: RegisterTickerArgs) => {
    const method = this.contract.methods.registerTicker(owner, ticker, tokenName);
    const options = await getOptions(method, { from: this.context.account });
    return () => method.send(options);
  };

  public getTickerDetails = async ({ ticker }: GetTickerDetailsArgs) => {
    const details = await this.contract.methods.getTickerDetails(ticker).call();

    return details;
  };

  /**
   * While lacking a public, smart contract function to check for ticker availability, this function attempts to
   * immitate the internal function SecurityTokenRegistry._tickerAvailable()
   * @see https://github.com/PolymathNetwork/polymath-core/blob/aa635df01588f733ce95bc13fe319c7d3c858a24/contracts/SecurityTokenRegistry.sol#L318
   */
  public isTickerAvailable = async ({ ticker }: IsTickerAvailableArgs): Promise<boolean> => {
    try {
      const { 0: owner, 2: expiryDate, 4: status } = await this.getTickerDetails({ ticker });
      const intExpiryDate = parseInt(expiryDate);
      if (owner !== ZERO_ADDRESS) {
        if (Date.now() > intExpiryDate * 1000 && !status) {
          return true;
        }
        return false;
      }

      return true;
    } catch (error) {
      throw new PolymathError({ code: ErrorCodes.UnexpectedReturnData });
    }
  };

  public generateNewSecurityToken = async ({
    tokenName,
    ticker,
    tokenDetails,
    divisible,
  }: GenerateNewSecurityTokenArgs) => {
    if (!this.context.account)
      throw new Error(
        'You must pass your private key to PolyClient.connect() in order to generate a new token.'
      );

    const treasuryWallet = this.context.account;
    const protocolVersion = version.pack(3, 0, 0);
    const method = this.contract.methods.generateNewSecurityToken(
      tokenName,
      ticker,
      tokenDetails,
      divisible,
      treasuryWallet,
      protocolVersion
    );
    const options = await getOptions(method, { from: this.context.account });
    return () => method.send(options);
  };

  public async getTickerRegistrationFee() {
    const feeRes = await this.contract.methods.getTickerRegistrationFee().call();
    return fromWei(feeRes);
  }

  public async getSecurityTokenLaunchFee() {
    const feeRes = await this.contract.methods.getSecurityTokenLaunchFee().call();
    return fromWei(feeRes);
  }

  public async getLatestProtocolVersion() {
    return await this.contract.methods.getLatestProtocolVersion().call();
  }

  public async getSecurityToken({ ticker }: GetSecurityTokenArgs) {
    const address = await this.contract.methods.getSecurityTokenAddress(ticker).call();

    if (address === ZERO_ADDRESS) {
      return null;
    }

    return await ContractWrapperFactory.getSecurityToken(address, this.context);
  }
}
