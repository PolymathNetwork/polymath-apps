import { polyClient } from '~/lib/polyClient';
import { cacheData, fetchDataFail } from '~/state/actions/dataRequests';
import { createAction as createDividend } from '~/state/actions/dividends';
import { call, put } from 'redux-saga/effects';
import { Dividend, DividendModuleTypes } from '@polymathnetwork/sdk';
import { RequestKeys } from '~/types';

export function* fetchDividendsByCheckpoint(args: {
  securityTokenSymbol: string;
  checkpointIndex: number;
}) {
  try {
    const { securityTokenSymbol, checkpointIndex } = args;
    const dividends: Dividend[] = yield call(polyClient.getDividends, {
      symbol: securityTokenSymbol,
      checkpointIndex,
    });

    const fetchedIds: string[] = [];

    const dividendPojos = dividends.map(dividend => dividend.toPojo());
    for (const dividend of dividendPojos) {
      const { uid, index, dividendType } = dividend;
      fetchedIds.push(uid);

      yield put(createDividend(dividend));

      yield put(
        cacheData({
          requestKey: RequestKeys.GetDividendBySymbolAndId,
          args: {
            symbol: securityTokenSymbol,
            dividendIndex: index,
            dividendType,
          },
          fetchedIds: [uid],
        })
      );
    }

    yield put(
      cacheData({
        requestKey: RequestKeys.GetDividendsByCheckpoint,
        args,
        fetchedIds,
      })
    );
  } catch (err) {
    yield put(fetchDataFail(err));
  }
}

export function* fetchDividendBySymbolAndId(args: {
  securityTokenSymbol: string;
  dividendIndex: number;
  dividendType: DividendModuleTypes;
}) {
  try {
    const { securityTokenSymbol, dividendIndex, dividendType } = args;
    const dividends: Dividend[] = yield call(polyClient.getDividend, {
      symbol: securityTokenSymbol,
      dividendType,
      dividendIndex,
    });

    const fetchedIds: string[] = [];

    const dividendPojos = dividends.map(dividend => dividend.toPojo());
    for (const dividend of dividendPojos) {
      fetchedIds.push(dividend.uid);

      yield put(createDividend(dividend));
    }

    yield put(
      cacheData({
        requestKey: RequestKeys.GetDividendBySymbolAndId,
        args,
        fetchedIds,
      })
    );
  } catch (err) {
    yield put(fetchDataFail(err));
  }
}
