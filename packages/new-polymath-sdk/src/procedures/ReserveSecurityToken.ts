import { Procedure } from './Procedure';
import { Approve } from './Approve';
import { types } from '@polymathnetwork/new-shared';
import { IApprove, IRegisterTicker } from '@polymathnetwork/contract-wrappers';

interface Args {
  symbol: string;
  name: string;
}

export class ReserveSecurityToken extends Procedure<Args> {
  public type = types.ProcedureTypes.ReserveSecurityToken;
  public async prepareTransactions() {
    const { symbol, name } = this.args;
    const { securityTokenRegistry, currentWallet, polyToken } = this.context;

    // TODO @RafaelVidaurre: See if ticker is not already registered

    const fee = await securityTokenRegistry.getTickerRegistrationFee();

    const approvalParams: IApprove = { spender: 'securityTokenRegistry.address', value: fee }
    await this.addTransaction(polyToken.approve, {
      tag: types.PolyTransactionTags.Approve,
    })(approvalParams);

    const registerTicerParams: IRegisterTicker = { ticker: symbol, tokenName: name }
    await this.addTransaction(securityTokenRegistry.registerTicker, {
      tag: types.PolyTransactionTags.ReserveSecurityToken,
    })(registerTicerParams);
  }
}
