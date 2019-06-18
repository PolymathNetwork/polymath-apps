import { Procedure } from './Procedure';
import { DividendModuleTypes } from '../LowLevel/types';
import {
  EnableDividendModulesProcedureArgs,
  ProcedureTypes,
  PolyTransactionTags,
  ErrorCodes,
} from '../types';
import { PolymathError } from '../PolymathError';

export class EnableDividendModules extends Procedure<EnableDividendModulesProcedureArgs> {
  public type = ProcedureTypes.EnableDividendModules;

  public async prepareTransactions() {
    const {
      symbol,
      storageWalletAddress,
      types = [DividendModuleTypes.Erc20, DividendModuleTypes.Eth],
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

    for (const type of types) {
      await this.addTransaction(securityToken.addDividendsModule, {
        tag: PolyTransactionTags.EnableDividends,
      })({ type, wallet: storageWalletAddress });
    }
  }
}
