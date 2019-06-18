import { chunk } from 'lodash';
import { Procedure } from './Procedure';
import {
  PushDividendPaymentProcedureArgs,
  DividendModuleTypes,
  ProcedureTypes,
  PolyTransactionTags,
  ErrorCodes,
} from '../types';
import { PolymathError } from '../PolymathError';

const CHUNK_SIZE = 100;

export class PushDividendPayment extends Procedure<PushDividendPaymentProcedureArgs> {
  public type = ProcedureTypes.PushDividendPayment;

  public async prepareTransactions() {
    const { symbol, dividendIndex, investorAddresses, dividendType } = this.args;
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
        dividendIndex,
      });
    }

    const dividend = await dividendsModule.getDividend({ dividendIndex });
    const { investors: investorStatuses } = dividend;

    const unpaidInvestors = investors.filter(investorAddress => {
      const investorStatus = investorStatuses.find(status => status.address === investorAddress);

      return !!investorStatus && !investorStatus.paymentReceived;
    });

    const investorAddressChunks = chunk(unpaidInvestors, CHUNK_SIZE);

    for (const addresses of investorAddressChunks) {
      await this.addTransaction(dividendsModule.pushDividendPayment, {
        tag: PolyTransactionTags.PushDividendPayment,
      })({
        dividendIndex,
        investorAddresses: addresses,
      });
    }
  }
}
