import { Procedure } from './Procedure';
import {
  CreateErc20DividendDistributionProcedureArgs,
  ProcedureTypes,
  PolyTransactionTags,
  ErrorCodes,
} from '../types';
import { Approve } from '../procedures/Approve';
import { PolymathError } from '../PolymathError';

export class CreateErc20DividendDistribution extends Procedure<
  CreateErc20DividendDistributionProcedureArgs,
  number
> {
  public type = ProcedureTypes.CreateErc20DividendDistribution;

  public async prepareTransactions() {
    const {
      symbol,
      maturityDate,
      expiryDate,
      erc20Address,
      amount,
      checkpointIndex,
      name,
      excludedAddresses,
      taxWithholdings = [],
    } = this.args;
    const { securityTokenRegistry } = this.context;

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: symbol,
    });

    if (!securityToken) {
      throw new PolymathError({
        code: ErrorCodes.ProcedureValidationError,
        message: `There is no Security Token with symbol ${symbol}`,
      });
    }

    const erc20Module = await securityToken.getErc20DividendModule();

    if (!erc20Module) {
      throw new Error(
        "Dividend modules haven't been enabled. Did you forget to call .enableDividendModules()?"
      );
    }

    await this.addTransaction(Approve)({
      amount,
      spender: erc20Module.address,
      tokenAddress: erc20Address,
    });

    const dividendIndex = await this.addTransaction(erc20Module.createDividend, {
      tag: PolyTransactionTags.CreateErc20DividendDistribution,
      // TODO @monitz87: replace this with the correct receipt type when we integrate the SDK with
      // the contract-wrappers package
      resolver: async receipt => {
        const { events } = receipt;

        if (events) {
          const { ERC20DividendDeposited } = events;

          const {
            _dividendIndex,
          }: {
            _dividendIndex: string;
          } = ERC20DividendDeposited.returnValues;

          return parseInt(_dividendIndex, 10);
        }
      },
    })({
      maturityDate,
      expiryDate,
      tokenAddress: erc20Address,
      amount,
      checkpointId: checkpointIndex,
      name,
      excludedAddresses,
    });

    if (taxWithholdings.length > 0) {
      const investors: string[] = [];
      const percentages: number[] = [];

      taxWithholdings.forEach(({ address, percentage }) => {
        investors.push(address);
        percentages.push(percentage);
      });

      await this.addTransaction(erc20Module.setWithholding, {
        tag: PolyTransactionTags.SetErc20TaxWithholding,
      })({ investors, percentages });
    }

    return dividendIndex;
  }
}
