import { Procedure } from './Procedure';
import { ProcedureTypes, PolyTransactionTags, SetControllerArgs, ErrorCodes } from '../types';
import { PolymathError } from '../PolymathError';
import { isValidAddress } from '../utils';

export class SetController extends Procedure<SetControllerArgs> {
  public type = ProcedureTypes.SetController;

  public async prepareTransactions() {
    const { symbol, controller } = this.args;
    const { securityTokenRegistry, currentWallet } = this.context;

    const token = await securityTokenRegistry.getSecurityToken({
      ticker: symbol,
    });

    /**
     * Validation
     */

    if (!token) {
      throw new PolymathError({
        code: ErrorCodes.ProcedureValidationError,
        message: `There is no Security Token with symbol ${symbol}`,
      });
    }

    if (!isValidAddress(controller)) {
      throw new PolymathError({
        code: ErrorCodes.ProcedureValidationError,
        message: `Controller address "${controller}" is invalid.`,
      });
    }

    const owner = await token.owner();
    let account: string;

    if (currentWallet) {
      ({ address: account } = currentWallet);
    } else {
      throw new PolymathError({
        message:
          "No default account set. You must pass token owner's private key to Polymath.connect()",
        code: ErrorCodes.ProcedureValidationError,
      });
    }

    if (account !== owner) {
      throw new PolymathError({
        code: ErrorCodes.ProcedureValidationError,
        message: `You must be the owner of this Security Token to set the controller`,
      });
    }

    /**
     * Transactions
     */

    await this.addTransaction(token.setController, {
      tag: PolyTransactionTags.SetController,
    })({ controller });
  }
}
