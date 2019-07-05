import { Procedure } from './Procedure';
import { Approve } from './Approve';
import {
  ReserveSecurityTokenProcedureArgs,
  ProcedureTypes,
  PolyTransactionTags,
  ErrorCodes,
} from '../types';
import { PolymathError } from '../PolymathError';

export class ReserveSecurityToken extends Procedure<ReserveSecurityTokenProcedureArgs> {
  public type = ProcedureTypes.ReserveSecurityToken;

  public async prepareTransactions() {
    const { symbol, name, owner } = this.args;
    const { securityTokenRegistry, currentWallet } = this.context;

    let ownerAddress: string;

    if (owner) {
      ownerAddress = owner;
    } else if (currentWallet) {
      ({ address: ownerAddress } = currentWallet);
    } else {
      throw new PolymathError({
        message: "No default account set. You must pass the owner's address as a parameter",
        code: ErrorCodes.ProcedureValidationError,
      });
    }

    const isAvailable = await securityTokenRegistry.isTickerAvailable({
      ticker: symbol,
    });
    if (!isAvailable) {
      throw new PolymathError({
        message: `Ticker ${symbol} has already been registered`,
        code: ErrorCodes.ProcedureValidationError,
      });
    }

    const fee = await securityTokenRegistry.getTickerRegistrationFee();
    await this.addTransaction(Approve)({
      amount: fee,
      spender: securityTokenRegistry.address,
      owner: ownerAddress,
    });

    await this.addTransaction(securityTokenRegistry.registerTicker, {
      tag: PolyTransactionTags.ReserveSecurityToken,
    })({ owner: ownerAddress, ticker: symbol, tokenName: name });
  }
}
