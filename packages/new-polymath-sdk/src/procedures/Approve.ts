import { Procedure } from './Procedure';
import { types } from '@polymathnetwork/new-shared';
import { ApproveProcedureArgs } from '~/types';
import { PolyToken } from '~/LowLevel/PolyToken';

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

    const allowance = await token.allowance({ spender, tokenOwner: address });
    const hasEnoughAllowance = allowance.gte(amount);

    if (hasEnoughAllowance) {
      return;
    }

    const balance = await token.balanceOf({ address });

    if (balance.lt(amount)) {
      if (isTestnet && token instanceof PolyToken) {
        await this.addTransaction(token.getTokens, {
          tag: types.PolyTransactionTags.GetTokens,
        })({ amount, recipient: address });
      } else {
        throw new Error('Not enough balance');
      }
    }
    await this.addTransaction(token.approve, {
      tag: types.PolyTransactionTags.Approve,
    })({ spender, amount });
  }
}
