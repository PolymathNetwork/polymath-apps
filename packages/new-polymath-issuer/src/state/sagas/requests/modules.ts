import { polyClient } from '~/lib/polyClient';
import { cacheData, fetchDataFail } from '~/state/actions/dataRequests';
import { createAction as createErc20DividendsModule } from '~/state/actions/erc20DividendsModule';
import { call, put } from 'redux-saga/effects';
import { Erc20DividendsModule } from '@polymathnetwork/sdk';
import { RequestKeys } from '~/types';

export function* fetchErc20DividendsModuleBySymbol(args: {
  securityTokenSymbol: string;
}) {
  const { securityTokenSymbol } = args;
  const dividendsModule: Erc20DividendsModule = yield call(
    polyClient.getErc20DividendsModule,
    {
      symbol: securityTokenSymbol,
    }
  );

  const fetchedIds: string[] = [];

  if (dividendsModule) {
    const modulePojo = dividendsModule.toPojo();
    yield put(createErc20DividendsModule(modulePojo));
    fetchedIds.push(modulePojo.uid);
  }

  yield put(
    cacheData({
      requestKey: RequestKeys.GetErc20DividendsModuleBySymbol,
      args,
      fetchedIds,
    })
  );
}
