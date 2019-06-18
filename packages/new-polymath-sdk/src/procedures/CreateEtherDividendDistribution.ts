import { Procedure } from './Procedure';
import {
  CreateEtherDividendDistributionProcedureArgs,
  ProcedureTypes,
  PolyTransactionTags,
  ErrorCodes,
} from '../types';
import { PolymathError } from '../PolymathError';

export class CreateEtherDividendDistribution extends Procedure<
  CreateEtherDividendDistributionProcedureArgs
> {
  public type = ProcedureTypes.CreateEtherDividendDistribution;

  public async prepareTransactions() {
    const {
      symbol,
      maturityDate,
      expiryDate,
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

    const etherModule = await securityToken.getEtherDividendModule();

    if (!etherModule) {
      throw new Error(
        "Dividend modules haven't been enabled. Did you forget to call .enableDividendModules()?"
      );
    }

    await this.addTransaction(etherModule.createDividend, {
      tag: PolyTransactionTags.CreateEtherDividendDistribution,
    })({
      maturityDate,
      expiryDate,
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

      await this.addTransaction(etherModule.setWithholding, {
        tag: PolyTransactionTags.SetEtherTaxWithholding,
      })({ investors, percentages });
    }
  }
}
