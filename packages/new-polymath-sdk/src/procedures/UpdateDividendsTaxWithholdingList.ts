import { chunk } from 'lodash';
import { Procedure } from './Procedure';
import { DividendModuleTypes } from '../LowLevel/types';
import { DividendCheckpoint } from '../LowLevel/DividendCheckpoint';
import {
  UpdateDividendsTaxWithholdingListProcedureArgs,
  ProcedureTypes,
  PolyTransactionTags,
  ErrorCodes,
} from '../types';
import { PolymathError } from '../PolymathError';

const CHUNK_SIZE = 200;

export class UpdateDividendsTaxWithholdingList extends Procedure<
  UpdateDividendsTaxWithholdingListProcedureArgs
> {
  public type = ProcedureTypes.UpdateDividendsTaxWithholdingList;

  public async prepareTransactions() {
    const { symbol, dividendType, investorAddresses: investors, percentages } = this.args;
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

    let dividendModule: DividendCheckpoint | null = null;

    switch (dividendType) {
      case DividendModuleTypes.Erc20:
        dividendModule = await securityToken.getErc20DividendModule();
        break;
      case DividendModuleTypes.Eth:
        dividendModule = await securityToken.getEtherDividendModule();
    }

    if (!dividendModule) {
      throw new Error('There is no attached dividend module of the specified type');
    }

    const investorAddressChunks = chunk(investors, CHUNK_SIZE);
    const percentageChunks = chunk(percentages, CHUNK_SIZE);

    for (let index = 0; index < investorAddressChunks.length; index += 1) {
      await this.addTransaction(dividendModule.setWithholding, {
        tag: PolyTransactionTags.SetErc20TaxWithholding,
      })({
        investors: investorAddressChunks[index],
        percentages: percentageChunks[index],
      });
    }
  }
}
