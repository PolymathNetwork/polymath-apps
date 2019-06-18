import { Procedure } from './Procedure';
import { ProcedureTypes, PolyTransactionTags, ControllerTransferArgs, ErrorCodes } from '../types';
import { PolymathError } from '../PolymathError';
import { isValidAddress } from '../utils';

export class ControllerTransfer extends Procedure<ControllerTransferArgs> {
  public type = ProcedureTypes.ControllerTransfer;

  public async prepareTransactions() {
    const { symbol, value, from, to, log: log = '', data: data = '' } = this.args;
    const { securityTokenRegistry, currentWallet } = this.context;
    const addresses: { [key: string]: string } = { from, to };

    /**
     * Validation
     */

    Object.keys(addresses).forEach(key => {
      if (!isValidAddress(addresses[key])) {
        throw new PolymathError({
          code: ErrorCodes.InvalidAddress,
          message: `Provided "${key}" address is invalid: ${addresses[key]}`,
        });
      }
    });

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: symbol,
    });

    if (!securityToken) {
      throw new PolymathError({
        code: ErrorCodes.ProcedureValidationError,
        message: `There is no Security Token with symbol ${symbol}`,
      });
    }

    const senderBalance = await securityToken.balanceOf({ address: from });
    if (senderBalance.lt(value)) {
      throw new PolymathError({
        code: ErrorCodes.InsufficientBalance,
        message: `Sender's balance "${senderBalance}" is less than the requested amount "${value}."`,
      });
    }

    const controller = await securityToken.controller();
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

    if (account !== controller) {
      throw new PolymathError({
        code: ErrorCodes.ProcedureValidationError,
        message: `You must be the controller of this Security Token to perform forced transfers. Did you remember to call "setController"?`,
      });
    }

    /**
     * Transactions
     */

    await this.addTransaction(securityToken.controllerTransfer, {
      tag: PolyTransactionTags.ControllerTransfer,
    })({ from, to, value, data, log });
  }
}
