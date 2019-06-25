import { polyClient } from '~/lib/polyClient';
import { cacheData } from '~/state/actions/dataRequests';
import { createAction as createErc20DividendsModule } from '~/state/actions/erc20DividendsModule';
import { call, put } from 'redux-saga/effects';
import { Erc20DividendsModule } from '@polymathnetwork/sdk';
import { RequestKeys, GetErc20DividendsModuleBySymbolArgs } from '~/types';

export function* fetchErc20DividendsModuleBySymbol(
  args: GetErc20DividendsModuleBySymbolArgs
) {
  const { symbol } = args;
  const dividendsModule: Erc20DividendsModule = yield call(
    polyClient.getErc20DividendsModule,
    {
      symbol: symbol,
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
