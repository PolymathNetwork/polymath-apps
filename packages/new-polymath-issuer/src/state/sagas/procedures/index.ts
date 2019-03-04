import { all } from 'redux-saga/effects';
import { takeOneAtATime } from '../helpers';
import { getType } from 'typesafe-actions';
import { enableErc20DividendsModule } from './modules';
import { createCheckpoint } from './checkpoints';
import {
  updateTaxWithholdingList,
  pushDividendPayment,
  createErc20DividendsDistribution,
  setDividendsWallet,
  withdrawDividendTaxes,
} from './dividends';
import {
  enableErc20DividendsModuleStart,
  createCheckpointStart,
  updateTaxWithholdingListStart,
  pushDividendPaymentStart,
  createErc20DividendDistributionStart,
  setDividendsWalletStart,
  withdrawDividendTaxesStart,
} from '~/state/actions/procedures';

export function* procedureWatcher() {
  yield all([
    takeOneAtATime(
      getType(enableErc20DividendsModuleStart),
      enableErc20DividendsModule
    ),
    takeOneAtATime(getType(createCheckpointStart), createCheckpoint),
    takeOneAtATime(
      getType(updateTaxWithholdingListStart),
      updateTaxWithholdingList
    ),
    takeOneAtATime(
      getType(createErc20DividendDistributionStart),
      createErc20DividendsDistribution
    ),
    takeOneAtATime(getType(pushDividendPaymentStart), pushDividendPayment),
    takeOneAtATime(getType(setDividendsWalletStart), setDividendsWallet),
    takeOneAtATime(getType(withdrawDividendTaxesStart), withdrawDividendTaxes),
  ]);
}
