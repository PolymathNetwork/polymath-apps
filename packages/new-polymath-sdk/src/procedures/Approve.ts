import { Procedure } from './Procedure';
import {
  ApproveProcedureArgs,
  ErrorCodes,
  ProcedureTypes,
  PolyTransactionTags,
} from '../types';
import { PolymathError } from '../PolymathError';
import { BigNumber } from 'bignumber.js';

export class Approve extends Procedure<ApproveProcedureArgs> {
  public type = ProcedureTypes.Approve;
  public async prepareTransactions() {
    const { amount, spender, tokenAddress, owner } = this.args;
    const { currentWallet, polyToken, isTestnet, getErc20Token } = this.context;

    let ownerAddress: string;

    if (owner) {
      ownerAddress = owner;
    } else if (currentWallet) {
      ({ address: ownerAddress } = currentWallet);
    } else {
      throw new PolymathError({
        message:
          "No default account set. You must pass the owner's address as a parameter",
        code: ErrorCodes.ProcedureValidationError,
      });
    }

    let token;

    if (tokenAddress) {
      // TODO @monitz87: check if token is valid ERC20 and handle the case where
      // it isn't
      token = getErc20Token({ address: tokenAddress });
    } else {
      token = polyToken;
    }

    const balance = await token.balanceOf({ address: ownerAddress });

    const symbol = await token.symbol();

    if (balance.lt(amount)) {
      if (isTestnet) {
        if (token.address.toUpperCase() === polyToken.address.toUpperCase()) {
          token = polyToken;
          await this.addTransaction(token.getTokens, {
            tag: PolyTransactionTags.GetTokens,
          })({
            amount: amount
              .minus(balance)
              .decimalPlaces(0, BigNumber.ROUND_HALF_UP),
            recipient: ownerAddress,
            symbol,
          });
        }
      } else {
        // TODO @monitz87: uncomment when we handle transaction errors properly in the Tx modal
        // throw new PolymathError({ code: ErrorCodes.ProcedureValidationError, message: 'Not enough funds.' });
      }
    }

    const allowance = await token.allowance({
      spender,
      tokenOwner: ownerAddress,
    });
    const hasEnoughAllowance = allowance.gte(amount);

    if (hasEnoughAllowance) {
      return;
    }

    await this.addTransaction(token.approve, {
      tag: PolyTransactionTags.Approve,
    })({ spender, amount, symbol, owner: ownerAddress });
  }
}
