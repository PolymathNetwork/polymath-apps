import { Procedure } from './Procedure';
import { DividendModuleTypes } from '../LowLevel/types';
import { DividendCheckpoint } from '../LowLevel/DividendCheckpoint';
import {
  ReclaimFundsProcedureArgs,
  ProcedureTypes,
  PolyTransactionTags,
  ErrorCodes,
} from '../types';
import { PolymathError } from '../PolymathError';

export class ReclaimFunds extends Procedure<ReclaimFundsProcedureArgs> {
  public type = ProcedureTypes.ReclaimFunds;

  public async prepareTransactions() {
    const { symbol, dividendIndex, dividendType } = this.args;
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

    let dividendModule: DividendCheckpoint | null = null;

    switch (dividendType) {
      case DividendModuleTypes.Erc20:
        dividendModule = await securityToken.getErc20DividendModule();
        break;
      case DividendModuleTypes.Eth:
        dividendModule = await securityToken.getEtherDividendModule();
    }

    if (!dividendModule) {
      throw new Error('There is no attached dividend module of the specified type');
    }

    await this.addTransaction(dividendModule.reclaimDividend, {
      tag: PolyTransactionTags.ReclaimDividendFunds,
    })({ dividendIndex });
  }
}
