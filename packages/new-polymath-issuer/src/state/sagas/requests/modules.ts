import { polyClient } from '~/lib/polymath';
import { cacheData, fetchDataFail } from '~/state/actions/dataRequests';
import { createAction as createErc20DividendsModule } from '~/state/actions/erc20DividendsModule';
import { call, put } from 'redux-saga/effects';
import { Erc20DividendsModule } from '@polymathnetwork/sdk';
import { RequestKeys } from '~/types';

export function* fetchErc20DividendsModuleBySymbol(args: {
  securityTokenSymbol: string;
}) {
  try {
    const { securityTokenSymbol } = args;
    const dividendsModule: Erc20DividendsModule = yield call(
      polyClient.getErc20DividendsModule,
      {
        symbol: securityTokenSymbol,
      }
    );

    const modulePojo = dividendsModule.toPojo();

    yield put(createErc20DividendsModule(modulePojo));

    yield put(
      cacheData({
        requestKey: RequestKeys.GetDividendsByCheckpoint,
        args,
        fetchedIds: [modulePojo.uid],
      })
    );
  } catch (err) {
    yield put(fetchDataFail(err));
  }
}
