import { polyClient } from '~/lib/polymath';
import { call } from 'redux-saga/effects';
import { ActionType } from 'typesafe-actions';
import { DividendModuleTypes } from '@polymathnetwork/sdk/build/dist/LowLevel/types';
import { Sequence as PolymathSequence } from '@polymathnetwork/sdk/build/dist/entities/Sequence';
import { enableErc20DividendsModuleStart } from '~/state/actions/procedures';
import { runSequence } from '~/state/sagas/sequences';

export function* enableErc20DividendsModule(
  action: ActionType<typeof enableErc20DividendsModuleStart>
) {
  const { securityTokenSymbol } = action.payload;
  const sequenceToRun: PolymathSequence = yield call(
    polyClient.enableDividendModules,
    {
      symbol: securityTokenSymbol,
      types: [DividendModuleTypes.Erc20],
    }
  );

  yield call(runSequence, sequenceToRun);
}
