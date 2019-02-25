import { polyClient } from '~/lib/polyClient';
import { cacheData, fetchDataFail } from '~/state/actions/dataRequests';
import { createAction as createDividend } from '~/state/actions/dividends';
import { call, put } from 'redux-saga/effects';
import { Dividend } from '@polymathnetwork/sdk';
import { RequestKeys } from '~/types';

export function* fetchDividendsByCheckpoint(args: {
  securityTokenSymbol: string;
  checkpointIndex: number;
}) {
  const { securityTokenSymbol, checkpointIndex } = args;
  const dividends: Dividend[] = yield call(polyClient.getDividends, {
    symbol: securityTokenSymbol,
    checkpointIndex,
  });

  const fetchedIds: string[] = [];

  const dividendPojos = dividends.map(dividend => dividend.toPojo());
  for (const dividend of dividendPojos) {
    fetchedIds.push(dividend.uid);

    yield put(createDividend(dividend));
  }

  yield put(
    cacheData({
      requestKey: RequestKeys.GetDividendsByCheckpoint,
      args,
      fetchedIds,
    })
  );
}
