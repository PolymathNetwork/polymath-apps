import { Procedure } from './Procedure';
import {
  ProcedureTypes,
  PolyTransactionTags,
  EnableGeneralPermissionManagerProcedureArgs,
  ErrorCodes,
} from '../types';
import { PolymathError } from '../PolymathError';

export class EnableGeneralPermissionManager extends Procedure<
  EnableGeneralPermissionManagerProcedureArgs
> {
  public type = ProcedureTypes.EnableGeneralPermissionManager;

  public async prepareTransactions() {
    const { symbol } = this.args;
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
    await this.addTransaction(securityToken.addGeneralPermissionManager, {
      tag: PolyTransactionTags.EnableGeneralPermissionManager,
    })();
  }
}
