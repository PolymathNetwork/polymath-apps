import { Procedure } from './Procedure';
import { types } from '@polymathnetwork/new-shared';
import { PushDividendPaymentProcedureArgs, DividendModuleTypes } from '~/types';
import { chunk } from 'lodash';

const CHUNK_SIZE = 100;

export class PushDividendPayment extends Procedure<
  PushDividendPaymentProcedureArgs
> {
  public type = types.ProcedureTypes.CreateErc20DividendDistribution;
  public async prepareTransactions() {
    const { symbol, dividendId, investorAddresses, dividendType } = this.args;
    const { securityTokenRegistry } = this.context;

    const securityToken = await securityTokenRegistry.getSecurityToken({
      ticker: symbol,
    });
    let dividendsModule;

    if (dividendType === DividendModuleTypes.Erc20) {
      dividendsModule = await securityToken.getErc20DividendModule();
    } else if (dividendType === DividendModuleTypes.Eth) {
      dividendsModule = await securityToken.getEtherDividendModule();
    }

    if (!dividendsModule) {
      throw new Error(
        "Dividend modules haven't been enabled. Did you forget to call .enableDividendModules()?"
      );
    }
    let investors: string[];

    if (investorAddresses) {
      investors = investorAddresses;
    } else {
      investors = await dividendsModule.getInvestors({
        dividendIndex: dividendId,
      });
    }

    const investorAddressChunks = chunk(investors, CHUNK_SIZE);

    for (const addresses of investorAddressChunks) {
      await this.addTransaction(dividendsModule.pushDividendPayment, {
        tag: types.PolyTransactionTags.PushDividendPayment,
      })({
        dividendIndex: dividendId,
        investorAddresses: addresses,
      });
    }
  }
}
