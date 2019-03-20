import { Procedure } from './Procedure';
import { types } from '@polymathnetwork/new-shared';
import { ApproveProcedureArgs, ErrorCodes } from '~/types';
import { PolymathError } from '~/PolymathError';
import { BigNumber } from 'bignumber.js';

export class Approve extends Procedure<ApproveProcedureArgs> {
  public type = types.ProcedureTypes.Approve;
  public async prepareTransactions() {
    const { amount, spender, tokenAddress } = this.args;
    const {
      currentWallet: { address },
      polyToken,
      isTestnet,
      getErc20Token,
    } = this.context;

    let token;

    if (tokenAddress) {
      // TODO @monitz87: check if token is valid ERC20 and handle the case where
      // it isn't
      token = getErc20Token({ address: tokenAddress });
    } else {
      token = polyToken;
    }

    const balance = await token.balanceOf({ address });

    const symbol = await token.symbol();

    if (balance.lt(amount)) {
      if (isTestnet) {
        if (token.address.toUpperCase() === polyToken.address.toUpperCase()) {
          token = polyToken;
          await this.addTransaction(token.getTokens, {
            tag: types.PolyTransactionTags.GetTokens,
          })({
            amount: amount
              .minus(balance)
              .decimalPlaces(0, BigNumber.ROUND_HALF_UP),
            recipient: address,
            symbol,
          });
        }
      } else {
        // TODO @monitz87: uncomment when we handle transaction errors properly in the Tx modal
        // throw new PolymathError({ code: ErrorCodes.ProcedureValidationError, message: 'Not enough funds.' });
      }
    }

    const allowance = await token.allowance({ spender, tokenOwner: address });
    const hasEnoughAllowance = allowance.gte(amount);

    if (hasEnoughAllowance) {
      return;
    }

    await this.addTransaction(token.approve, {
      tag: types.PolyTransactionTags.Approve,
    })({ spender, amount, symbol });
  }
}
