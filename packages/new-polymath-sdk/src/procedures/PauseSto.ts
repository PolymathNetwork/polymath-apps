import { Procedure } from './Procedure';
import { ProcedureTypes, PolyTransactionTags, PauseStoArgs, ErrorCodes } from '../types';
import { PolymathError } from '../PolymathError';
import { isValidAddress } from '../utils';

export class PauseSto extends Procedure<PauseStoArgs> {
  public type = ProcedureTypes.PauseSto;

  public async prepareTransactions() {
    const { symbol, stoModuleAddress } = this.args;
    const { securityTokenRegistry } = this.context;

    /**
     * Validation
     */

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: symbol,
    });

    if (!isValidAddress(stoModuleAddress)) {
      throw new PolymathError({
        code: ErrorCodes.InvalidAddress,
        message: `Invalid module address ${stoModuleAddress}`,
      });
    }

    if (!securityToken) {
      throw new PolymathError({
        code: ErrorCodes.ProcedureValidationError,
        message: `There is no Security Token with symbol ${symbol}`,
      });
    }

    const stoModule = await securityToken.getStoModule({ address: stoModuleAddress });
    if (!stoModule) {
      throw new PolymathError({
        code: ErrorCodes.ProcedureValidationError,
        message: `module ${stoModuleAddress} is either archived or hasn't been enabled.`,
      });
    }

    /**
     * Transactions
     */

    await this.addTransaction(stoModule.pause, {
      tag: PolyTransactionTags.PauseSto,
    })();
  }
}
